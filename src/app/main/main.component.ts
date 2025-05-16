import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../shared/services/database.service';
import { VideoModel } from '../shared/models/video.model';
import { VideoPlayerComponent } from '../shared/c/video-player/video-player.component';
import { ComunicationService } from '../shared/services/comunication.service';

@Component({
  selector: 'app-main',
  imports: [
    CommonModule,
    VideoPlayerComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  mainMenu:boolean = false;
  videos:any[] = [];
  categorys:string[] = [];

  constructor(
    private dbs: DatabaseService,
    private router:Router,
    private com: ComunicationService
  ){
    this.getVideoDetails()
  }


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.dbs.loadVideos();
  }

  logout(){
    this.router.navigateByUrl('')
  }

  goToMainMenu(){
    this.router.navigateByUrl('main')
  }

  getVideoDetails(){
    this.dbs.videos$.subscribe((v) => {
      v.forEach((obj) => {
        let data = {
          id:obj.id,
          title:obj.title,
          thumbnail:obj.thumbnail,
          category:obj.category,
        }
        this.videos.push(data)
        if (!this.categorys.includes(obj.category)) {
          this.categorys.push(obj.category)
        }
      })
    })
  }

  setActiveVideo(id:number){
    this.com.setactiveVideo(id)
  }

  get currentSource() {
    return this.com.currentSource
  }

}
