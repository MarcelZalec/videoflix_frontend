import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { VideoModel } from '../../models/video.model';
import * as Config from '../../config'
import videojs from 'video.js'
import { map } from 'rxjs';

@Component({
  selector: 'app-video-player',
  imports: [],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent {
  videos:VideoModel[] = [];
  currentSource = '';

  constructor(
    private dbs: DatabaseService,
    private router:Router,
  ){
    this.dbs.loadVideos();
    this.getVideos();
    this.jumpToLastTimestep();
  }

  getVideos() {
    this.dbs.videos$.subscribe((v) => {
      if (v && Array.isArray(v)) {
        this.videos = [];
        const formatted = v.map((v)=> {
          return {
            ...v,
            video_file: this.setVideoPath(v.video_file)
          }
        })
        this.videos.push(...formatted)
        console.log(this.videos)
      }
    })
  }

  setVideoPath(path:string): string{
    const replacePath = path.replace('', '')
    // this.currentSource = `${Config.STATIC_BASE_URL}media/${path}`;
    return `${Config.STATIC_BASE_URL}media/${path}`;
  }

  setactiveVideo1(id:number) {
    let video = this.videos.filter(v => v.id == id)
    if (video.length != 1) {
      console.error("video liste is zu lange es kann nur ein video wiedergegeben werden!", video.length)
    }
    this.currentSource=video[0].video_file
    console.log(video)
  }

  setactiveVideo(id: number = 1) {
    if (this.videos.length === 0) {
      console.error("Keine Videos geladen – kann kein aktives Video setzen!");
      return;
    }

    let video = this.videos.filter(v => v.id == id);
    if (video.length != 1) {
      console.error("Video-Liste hat die falsche Länge!", video.length);
      return;
    }

    this.currentSource = video[0].video_file;
    console.log(video);
  }

  seekBackward() {
    const video = document.querySelector("#target") as HTMLVideoElement;
    if (video) {
      video.currentTime -= 5; // 5 Sekunden zurück
      video.pause(); // Verhindert das Weiterspielen
    }
  }

  seekForward() {
    const video = document.querySelector("#target") as HTMLVideoElement;
    if (video) {
      video.currentTime += 5; // 5 Sekunden vor
      video.pause(); // Verhindert das Weiterspielen
    }
  }

  jumpToLastTimestep() {
    const video = document.querySelector("#target") as HTMLVideoElement;
    if (video) {
      video.addEventListener("loadedmetadata", () => {
        video.currentTime = 400;
      });
    }
  }

  test(){
    const videoElement = document.querySelector("#target") as HTMLVideoElement;
    videoElement.addEventListener("seeking", () => {
    console.log("Seeking activated at:", videoElement.currentTime);
    });
  }

}