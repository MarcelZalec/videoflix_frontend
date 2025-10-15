import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import * as Config from './../config' 
import { VideoModel } from '../models/video.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public videoSubject = new BehaviorSubject<VideoModel[]>([]);
  public videos$ = this.videoSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Loads videos from the backend endpoint and updates the video subject.
   * Enhances each video's thumbnail path by prefixing with media URL.
   * Handles errors gracefully and logs them to the console.
   * @returns A subscription to the video data stream (not recommended for component use).
   */
  async loadVideos() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http
      .get<VideoModel[]>(`${Config.FULL_VIDEOS_URL}`, { headers })
      .pipe(
        map((videos) =>
          videos.map(video => ({
            ...video,
            thumbnail: `${Config.MEDIA_URL}${video.thumbnail}`
          }))
        ),
        tap((v) => {
          this.videoSubject.next(v);
        }),
        catchError((e) => {
          console.error("Error loading videos:", e);
          return of([]);
        })
      )
      .subscribe();
  }
}