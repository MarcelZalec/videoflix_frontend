import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../shared/services/database.service';
import { ComunicationService } from '../shared/services/comunication.service';
import { FooterComponent } from '../shared/c/footer/footer.component';
import { HeaderComponent } from '../shared/c/header/header.component';
import { LittleHelpersService } from '../shared/services/little-helpers.service';

@Component({
  selector: 'app-main',
  imports: [
    CommonModule,
    FooterComponent,
    HeaderComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy {
  videos:any[] = [];
  latestVideos:any[] = [];
  categorys:string[] = [];
  videoSource:string | null = '';
  imgSource:string | null = '';
  currentE:any = null;
  all_categorys!:any[];
  // startVideo:any = null; // wird nicht mehr benötigt, da es jetzt über den ComunicationService läuft

  constructor(
    private dbs: DatabaseService,
    private router:Router,
    private com: ComunicationService,
    private lh: LittleHelpersService,
  ){
    this.getVideoDetails();
  }


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.videos = [];
    this.categorys = [];
    this.dbs.loadVideos();
    this.setStartVideo();
  }

  ngOnDestroy(): void {

  }

  getVideoDetails_OLD(){
    this.dbs.videos$.subscribe((v) => {
      v.forEach((obj) => {
        let data = {
          id:obj.id,
          title:obj.title,
          thumbnail:obj.thumbnail,
          category:obj.category,
          video:obj.video_file,
          description:obj.description,
        }
        this.videos.push(data)
        if (!this.categorys.includes(obj.category)) {
          this.categorys.push(obj.category)
        }
        this.latestVideos = this.videos
      })
    })
  }

  getVideoDetails(){
    this.dbs.videos$.subscribe((v) => {
      v.forEach((obj) => {
        let data = {
          id:obj.id,
          title:obj.title,
          thumbnail:obj.thumbnail,
          category:obj.category,
          video:obj.video_file,
          description:obj.description,
        }
        // Group videos by category in all_categorys
        if (!this.all_categorys) {
          this.all_categorys = [];
        }
        let catGroup = this.all_categorys.find(group => group.category === obj.category);
        if (catGroup) {
          catGroup.videos.push(data);
        } else {
          this.all_categorys.push({ category: obj.category, videos: [data] });
        }
        console.log(this.all_categorys)
        // this.videos.push(data)
        // if (!this.categorys.includes(obj.category)) {
        //   this.categorys.push(obj.category)
        // }
        this.latestVideos = this.videos
      })
    })
  }

  setActiveVideo(id:number){
    this.com.setactiveVideo(id)
    this.router.navigateByUrl('video')
  }

  clearStartVideo() {
    this.videoSource = '';
    this.imgSource = '';
    this.currentE = null;
    this.setStartVideo()
  }

  find(id: number): { categoryIndex: number, videoIndex: number } | null {
    if (!this.all_categorys) return null;
    for (let categoryIndex = 0; categoryIndex < this.all_categorys.length; categoryIndex++) {
      const videoIndex = this.all_categorys[categoryIndex].videos.findIndex((v: any) => v.id === id);
      if (videoIndex !== -1) {
        return { categoryIndex, videoIndex };
      }
    }
    return null;
  }

  setStartVideo(id?: number) {
    const videoElement = document.getElementById("backgroundVideo") as HTMLVideoElement;
    if (videoElement) {
      videoElement.muted = true;
      videoElement.autoplay = true;
    }
    if (id && this.all_categorys) {
      const found = this.find(id);
      if (found) {
        const videoObj = this.all_categorys[found.categoryIndex].videos[found.videoIndex];
        this.imgSource = videoObj.thumbnail;
        this.currentE = videoObj;
        // this.videoSource = this.com.setVideoPath(videoObj.video, false); // funktioniert weiß nur nicht ob ich das so mache
        return;
      }
    }
    // fallback/default
    this.imgSource = 'http://127.0.0.1:8000/media/thumbnails/All-Round_Home-Server_selbst_bauen_Ideal_für_Anfänger_inkl_Ubuntu_Installation_4gTwXcY.png';
    this.videoSource = '';
    this.currentE = null;
  }

  get currentSource() {
    return this.com.currentSource
  }

  get screenwidth() {
    return this.lh.checkScreenWith()
  }

  get currentElement() {
    return this.com.currentElement;
  }

}
