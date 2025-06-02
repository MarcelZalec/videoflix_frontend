import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { VideoModel } from '../models/video.model';
import * as Config from '../config'

@Injectable({
  providedIn: 'root'
})
export class ComunicationService {
  videos:VideoModel[] = [];
  currentElement:any;
  currentSource = '';
  resulution = '720p';
  // startVideo:any = null;

  constructor(
    private dbs: DatabaseService, 
  ) {}

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
      }
    })
  }

  setVideoPath(path:string): string{
    const updated_path = path.replace('.mp4', `_${this.resulution}_hls/index.m3u8`)
    return `${Config.MEDIA_URL}${updated_path}`;
  }

  setactiveVideoX(id:number) {
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

  setactiveVideo(id:number) {
    this.dbs.videos$.subscribe((v) => {
      v.forEach(element => {
        if (element.id == id) {
          this.currentElement = element
          let file = this.setVideoPath(element.video_file)
          this.currentSource = file
          // console.log("Aktiver Video abs. Pfad ===", this.currentSource, element.thumbnail)
        } else {
          console.warn("Kein Video mit der ID gefunden", element)
        }
      });
    })
  }

  getStartVideo() {
    this.getVideos()
    if (this.videos.length != 0) {
      // this.startVideo = `${this.videos[0].video_file}`
      console.log("Das ist das Video", this.videos[0].video_file)
      return `${this.videos[0].video_file}`
    }
    return null
  }

  clearVideo() {
    this.currentSource = '';
  }
}
