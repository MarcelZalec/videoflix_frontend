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
        controls: true,
        poster: this.element.thumbnail,
        html5: {
        vhs: {
          overrideNative: true,
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
          fullscreenToggle: false,
          volumePanel: {inline: false},
          pictureInPictureToggle: false,
        }
      })

      this.player.on('play', ()=> console.log('Video gestartet'))
      this.player.on('pause', ()=> console.log('Video gestopt'))

      this.player.on('error', () => console.error('Video.js error:', this.player?.error()));

      this.player.ready(() => {
        console.log('Player ready, loading source:', this.currentSource);
        this.player?.load();
      });
    }
  }

  ngOnDestroy(): void {
      if (this.player) {
        this.player.dispose();
      }
  }

  getActiveVideo(){
    this.element = this.com.currentElement
    // this.currentSource = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
    this.currentSource = this.com.currentSource;
    // console.log(this.element)
    // console.log(this.element)
  }

}