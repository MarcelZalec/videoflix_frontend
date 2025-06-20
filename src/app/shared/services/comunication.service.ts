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

  constructor(
    private dbs: DatabaseService, 
  ) {}

  /**
   * Fetches videos from the database service and sets formatted video paths.
   */
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

  /**
   * Updates the video path to include resolution-specific HLS format.
   * @param path Original video file path.
   * @param replace If false, returns raw media path. If true, returns HLS path.
   * @returns The updated or original video URL.
   */
  setVideoPath(path:string, replace:boolean = true): string{
    const updated_path = path.replace('.mp4', `_${this.resulution}_hls/index.m3u8`)
    if (!replace) {
      return `${Config.MEDIA_URL}${path}`;
    } else {
      return `${Config.MEDIA_URL}${updated_path}`;
    }
  }

  /**
   * Sets the active video by its ID and updates session storage with video info.
   * @param id The ID of the video to activate.
   */
  setactiveVideo(id:number) {
    this.dbs.videos$.subscribe((v) => {
      v.forEach(element => {
        if (element.id == id) {
          this.currentElement = element
          let file = this.setVideoPath(element.video_file)
          this.currentSource = file
          sessionStorage.setItem('current_video', this.currentSource)
          sessionStorage.setItem('title_video', this.currentElement.title)
        }
      });
    })
  }

  /**
   * Gets the path of the first video in the list as the default starting video.
   * @returns The HLS path string for the first video, or null if none found.
   */
  getStartVideo() {
    this.getVideos()
    if (this.videos.length != 0) {
      return `${this.videos[0].video_file}`
    }
    return null
  }

  /**
   * Clears the currently active video source.
   */
  clearVideo() {
    this.currentSource = '';
  }
}
