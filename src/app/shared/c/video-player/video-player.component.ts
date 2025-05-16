import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { VideoModel } from '../../models/video.model';
import * as Config from '../../config'
import videojs from 'video.js'
import { map } from 'rxjs';
import { ComunicationService } from '../../services/comunication.service';

@Component({
  selector: 'app-video-player',
  imports: [],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent {
  element:any;
  currentSource = '';

  constructor(
    private dbs: DatabaseService,
    private router:Router,
    private com: ComunicationService,
  ){
    this.jumpToLastTimestep();
    this.getActiveVideo();
  }

  getActiveVideo(){
    this.element = this.com.currentElement
    this.currentSource = this.com.currentSource;
    console.log(this.element)
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