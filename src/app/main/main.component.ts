import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
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
  private scrollEventListener!: (event: any) => void;

  constructor(
    private dbs: DatabaseService,
    private router:Router,
    private com: ComunicationService,
    private lh: LittleHelpersService,
  ){
    this.getVideoDetails();
    this.scrollEventListener = this.onScroll.bind(this);
  }

  ngOnInit(): void {
    this.videos = [];
    this.categorys = [];
    this.dbs.loadVideos();
    this.setStartVideo();
    window.addEventListener('scroll', this.scrollEventListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollEventListener);
  }

  onScroll(event: Event): void {
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 200 && window.innerWidth > 500) {
      this.clearStartVideo();
    } else {
      return
    }
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
          created_at:obj.created_at,
        }
        if (!this.all_categorys) {
          this.all_categorys = [];
        }
        let catGroup = this.all_categorys.find(group => group.category === obj.category);
        if (catGroup) {
          if (catGroup.videos.length > 0) {
            if (catGroup.videos.find((video: any) => video.id === obj.id)) {
              return
            } else {
              catGroup.videos.push(data);
            }
          }
        } else {
          this.all_categorys.push({ category: obj.category, videos: [data] });
        }
        this.setLatestVideos()
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


  // Diese Methode setzt die neuesten Videos, die in den letzten 48 Stunden hochgeladen wurden
  // und begrenzt die Anzahl auf 6 Videos.
  setLatestVideos() {
    this.all_categorys.forEach(e => {
      for (let i = 0; i < e.videos.length; i++) {
        e.videos[i].created_at = e.videos[i].created_at || new Date().toISOString(); // Sicherstellen, dass created_at gesetzt ist
        if (this.checkLast48Hours(e.videos[i].created_at)) {
          e.videos.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          this.latestVideos.push(e.videos[i]);
        }
        this.latestVideos = this.latestVideos.filter((video, index, self) =>
          index === self.findIndex((v) => v.id === video.id)
        ); // Duplikate entfernen
      }
      this.latestVideos.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      this.latestVideos = this.latestVideos.slice(0, 6); // Begrenze auf die neuesten 6 Videos
    })
  }

  checkLast48Hours(time: string | number | Date): boolean {
    const now = Date.now();
    const videoTime = new Date(time).getTime();
    const diff = now - videoTime;
    if (diff <= 48 * 60 * 60 * 1000 && diff >= 0) {
      return true;
    } else {
      return false;
    }
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