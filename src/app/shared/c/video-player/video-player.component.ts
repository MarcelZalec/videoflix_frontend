import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import videojs from 'video.js'
import { ComunicationService } from '../../services/comunication.service';
import Player from 'video.js/dist/types/player';

@Component({
  selector: 'app-video-player',
  imports: [],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('target', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @Input() videoOptions!: { sources: { src: string; type: string }[] };
  player?: Player;// videojs.Player; 
  element:any;
  currentSource = '';

  constructor(
    private com: ComunicationService,
  ){
    this.getActiveVideo();
  }

  ngOnInit(): void {
      
  }

  ngAfterViewInit(): void {
    this.initializePlayer();
  }

  private initializePlayer(): void {
    if (this.videoElement && this.videoElement.nativeElement) {
      this.player = videojs(this.videoElement.nativeElement, {
        ...this.videoOptions,
        controles: true,
        html5: {
        vhs: {
          enableLowInitialPlaylist: true,
          useDevicePixelRatio: false,
          smoothQualityChange: true,
        },
      },
      sources: [
        {
          src: this.currentSource,
          type: 'application/x-mpegURL',
        },
      ],
        controlBar: {
          fullscreenToogle: true,
          volumePanel: {inline: false},
          pictureInPictureToggle: false,
        }
      })

      this.player.on('play', ()=> console.log('Video gestartet'))
      this.player.on('pause', ()=> console.log('Video gestopt'))
    }
  }

  ngOnDestroy(): void {
      if (this.player) {
        this.player.dispose();
      }
  }

  getActiveVideo(){
    this.element = this.com.currentElement
    this.currentSource = this.com.currentSource;
    // console.log(this.element)
  }

}