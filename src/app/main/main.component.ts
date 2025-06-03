import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../shared/services/database.service';
import { ComunicationService } from '../shared/services/comunication.service';
import { FooterComponent } from '../shared/c/footer/footer.component';
import { HeaderComponent } from '../shared/c/header/header.component';

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

  constructor(
    private dbs: DatabaseService,
    private router:Router,
    private com: ComunicationService,
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

  getVideoDetails(){
    this.dbs.videos$.subscribe((v) => {
      v.forEach((obj) => {
        let data = {
          id:obj.id,
          title:obj.title,
          thumbnail:obj.thumbnail,
          category:obj.category,
          video:obj.video_file
        }
        this.videos.push(data)
        if (!this.categorys.includes(obj.category)) {
          this.categorys.push(obj.category)
        }
        this.latestVideos = this.videos
      })
    })
  }

  setActiveVideo(id:number){
    this.com.setactiveVideo(id)
    this.router.navigateByUrl('video')
  }

  setStartVideo(id?:number) {
    const videoElement = document.getElementById("backgroundVideo") as HTMLVideoElement;
    if (videoElement) {
      videoElement.muted = true;
      videoElement.autoplay = true;
    }
    if (id) {
      let index = this.videos.findIndex((vid) => vid.id === id)
      this.imgSource = this.videos[index].thumbnail
      // this.videoSource = this.com.setVideoPath(this.videos[index].video, false)
      this.videoSource = ''
    } else {
      this.videoSource = 'http://127.0.0.1:8000/media/videos/All-Round_Home-Server_selbst_bauen_Ideal_f%C3%BCr_Anf%C3%A4nger_inkl_Ubuntu_Installation.mp4'
    }
  }

  clearStartVideo() {
    this.videoSource = '';
    this.imgSource = '';
    this.setStartVideo()
  }

  get currentSource() {
    return this.com.currentSource
  }

}
