import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../shared/services/database.service';
import { VideoModel } from '../shared/models/video.model';
import { VideoPlayerComponent } from '../shared/c/video-player/video-player.component';

@Component({
  selector: 'app-main',
  imports: [
    CommonModule,
    VideoPlayerComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  mainMenu:boolean = false;
  videos:VideoModel[] = []

  constructor(
    private dbs: DatabaseService,
    private router:Router,
  ){
    this.dbs.loadVideos();
  }

  logout(){
    this.router.navigateByUrl('')
  }

  goToMainMenu(){
    this.router.navigateByUrl('main')
  }

}
