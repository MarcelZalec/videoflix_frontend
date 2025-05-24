import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import videojs from 'video.js'
import { ComunicationService } from '../../services/comunication.service';

@Component({
  selector: 'app-video-player',
  imports: [],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('target', { static: true }) videoElement!: ElementRef;
  @Input() videoOptions!: { sources: { src: string; type: string }[] };
  private player!:any;// videojs.Player; 
  element:any;
  currentSource = '';

  constructor(
    private com: ComunicationService,
  ){
    this.getActiveVideo();
  }

  ngOnInit(): void {
      
  }

  initializePlayer() {
    if (this.videoElement && this.videoElement.nativeElement) {
      this.player = videojs(this.videoElement.nativeElement, {
        ...this.videoOptions,
        controlBar: {
          fullscreenToogle: true,
          volumePanel: {inline: false}
        }
      })

      this.player.on('play', ()=> console.log('Video gestartet'))
      this.player.on('pause', ()=> console.log('Video gestopt'))
    }
  }

  ngOnDestroy(): void {
      if (this.player) {
        this.player.disponse();
      }
  }

  getActiveVideo(){
    this.element = this.com.currentElement
    this.currentSource = this.com.currentSource;
    console.log(this.element)
  }

}