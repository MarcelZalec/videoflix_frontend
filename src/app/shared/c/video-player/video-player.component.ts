import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import videojs from 'video.js'
import { ComunicationService } from '../../services/comunication.service';
import Player from 'video.js/dist/types/player';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-video-player',
  imports: [HeaderComponent],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent implements OnDestroy, AfterViewInit {
  @ViewChild('target', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @Input() videoOptions!: { sources: { src: string; type: string }[] };
  private mouseMoveListener!: (event: MouseEvent) => void;
  private timeoutId: number | undefined;
  player!: Player;// videojs.Player; 
  element:any;
  currentSource = '';

  constructor(
    private com: ComunicationService,
  ){
    this.getActiveVideo();
    this.mouseMoveListener = (event: MouseEvent) => {
      this.showHeader()
    }
    document.addEventListener('mousemove', this.mouseMoveListener)
  }

  ngAfterViewInit(): void {
    this.checkStorage();
    this.initializePlayer();
  }

  private initializePlayer(): void {
    if (this.videoElement && this.videoElement.nativeElement) {
      this.player = videojs(this.videoElement.nativeElement, {
        ...this.videoOptions,
        controls: true,
        // poster: this.element.thumbnail,
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
          volumePanel: {inline: true},
          pictureInPictureToggle: false,
          skipButtons: {
            forward: 10, // 10 Sekunden vorwärts
            backward: 10 // 10 Sekunden zurück
          },
        },
      })

      // // Skip-Funktionen
      // const skipForward = () => this.player.currentTime(this.player.currentTime() + 10);
      // const skipBackward = () => this.player.currentTime(this.player.currentTime() - 10);

      // // Buttons hinzufügen
      // document.getElementById('skipForward')?.addEventListener('click', skipForward);
      // document.getElementById('skipBackward')?.addEventListener('click', skipBackward);

      this.player.setIcon

      this.player.on('play', ()=> {})
      this.player.on('pause', ()=> {})

      this.player.on('error', () => console.error('Video.js error:', this.player?.error()));
      this.player.on('volumechange', () => {
        const currentVolume = this.player.volume();
        if (currentVolume) {
          localStorage.setItem('videoVolume', currentVolume.toString())
        }
      })

      this.player.ready(() => {
        this.setAndGetCurrentTime(false);
        this.player.volume(parseFloat(localStorage.getItem('videoVolume') || '0.5'))
        this.player.load();
      });
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.mouseMoveListener)
    this.setAndGetCurrentTime();
    if (this.player) {
      this.player.dispose();
    }
    sessionStorage.removeItem('current_video')
    sessionStorage.removeItem('title_video')
  }

  getActiveVideo(){
    this.element = this.com.currentElement
    this.currentSource = this.com.currentSource;
  }

  showHeader(): void {
    const header = document.getElementById('head');
    if (header) {
      header.classList.remove('fadeOut'); // Entfernt die Ausblend-Animation
      header.classList.add('fadeIn'); // Fügt die Einblend-Animation hinzu

      // Falls bereits ein Timeout läuft, abbrechen
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      // Nach 2 Sekunden wieder ausblenden
      this.timeoutId = window.setTimeout(() => {
        header.classList.remove('fadeIn'); // Entfernt die Einblend-Animation
        header.classList.add('fadeOut'); // Fügt die Ausblend-Animation hinzu
      }, 2000);
    }
  }

  checkStorage() {
    let video = sessionStorage.getItem('current_video')
    if (video !== null) {
      this.currentSource = video
    }
  }

  setAndGetCurrentTime(get:boolean = true) {
    let time = this.player.currentTime()
    if (get && time) {
      let strTime = time.toString()
      sessionStorage.setItem('current_time_video', strTime)
    } else {
      let t = sessionStorage.getItem('current_time_video') || 0
      this.player.currentTime(`${t}`)
    }
  }

}