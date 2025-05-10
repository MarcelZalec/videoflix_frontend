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

  async loadVideos() {
    return this.http
      .get<VideoModel[]>(`${Config.FULL_VIDEOS_URL}`)
      .pipe(
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