import { Component, ElementRef, Input, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import videojs from 'video.js'
import { ComunicationService } from '../../services/comunication.service';
import Player from 'video.js/dist/types/player';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-player',
  imports: [HeaderComponent, CommonModule],
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
  showQualityPicker = false;
  currentQuality = '720'; // Default quality

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
        this.player.volume(parseFloat(localStorage.getItem('videoVolume') || '1'))
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
    this.element = this.com.currentElement;
    if (!this.element) {
      this.element = sessionStorage.getItem('current_element_thumbnail') || '';
    } else {
      sessionStorage.setItem('current_element_thumbnail', this.element.thumbnail);
    }
    this.currentSource = this.com.currentSource;
  }

  showHeader(): void {
    const obj = [
      document.getElementById('head'),
      document.getElementById('qualitySymbol'),
    ] as HTMLElement[];
    if (obj && obj.length > 0) {
      obj.forEach(el => {
        el.classList.remove('fadeOut'); // Entfernt die Ausblend-Animation
        el.classList.add('fadeIn'); // Fügt die Einblend-Animation hinzu
      });

      // Falls bereits ein Timeout läuft, abbrechen
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      // Nach 2 Sekunden wieder ausblenden
      this.timeoutId = window.setTimeout(() => {
        obj.forEach(el => {
          el.classList.remove('fadeIn'); // Entfernt die Einblend-Animation
          el.classList.add('fadeOut'); // Fügt die Ausblend-Animation hinzu
        });
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

  toggleQualityPicker() {
    const qualityPicker = document.getElementById('qualityPicker');
    if (qualityPicker) {
      qualityPicker.classList.toggle('d-none');
      this.showQualityPicker = !this.showQualityPicker;

      if (this.showQualityPicker) {
        // Add click listener to close when clicking outside
        setTimeout(() => {
          document.addEventListener('mousedown', this.handleOutsideClick);
          document.getElementById('qualityBackground')?.classList.toggle('d-none');
        });
      } else {
        document.removeEventListener('mousedown', this.handleOutsideClick);
      }
    }
  }

  private handleOutsideClick = (event: MouseEvent) => {
    const qualityPicker = document.getElementById('qualityPicker');
    if (qualityPicker && !qualityPicker.contains(event.target as Node)) {
      qualityPicker.classList.add('d-none');
      this.showQualityPicker = false;
      document.removeEventListener('mousedown', this.handleOutsideClick);
    }
  }

  changeQality(quality: string) {
    document.getElementById('qualityBackground')?.classList.toggle('d-none');
    let playTime = this.player.currentTime()
    const source = this.currentSource;
    if (source) {
      this.currentQuality = quality;
      const newSrc = this.currentSource.replace(/_\d{3,4}p/, `_${quality}p`); // Replace any _[3 or 4 digits]p with the new quality
      sessionStorage.setItem('current_video', newSrc);
      this.player.src(newSrc);
      this.player.load();
      this.player.currentTime(playTime);
      this.player.play();
    }
  }

  private qualityCheckIntervalId: any = null;

  checkInternetSpeedAndSetQuality() {
    // Define quality thresholds in Mbps
    const qualityMap = [
      { quality: '1080', minSpeed: 8 },
      { quality: '720', minSpeed: 4 },
      { quality: '480', minSpeed: 2 },
      { quality: '360', minSpeed: 1 },
      { quality: '240', minSpeed: 0 }
    ];

    const testImage = `${this.element.thumbnail}`; // Small image for speed test
    const imageSizeBytes = 703; // Approximate size of the image in bytes

    const measureSpeed = (): Promise<number> => {
      return new Promise(resolve => {
        const startTime = Date.now();
        const img = new Image();
        img.onload = () => {
          const duration = (Date.now() - startTime) / 1000;
          const bitsLoaded = imageSizeBytes * 8;
          const speedMbps = (bitsLoaded / duration) / (1024 * 1024);
          resolve(speedMbps);
        };
        img.onerror = () => resolve(0);
        img.src = `${testImage}?cacheBust=${Math.random()}`;
      });
    };

    const setQualityBySpeed = (speed: number) => {
      for (const q of qualityMap) {
        if (speed >= q.minSpeed) {
          if (this.currentQuality !== q.quality) {
            this.changeQality(q.quality);
          }
          break;
        }
      }
    };

    const checkAndSet = async () => {
      console.log('Checking internet speed...');
      const speed = await measureSpeed();
      setQualityBySpeed(speed);
    };

    // Only start interval if not already running
    if (!this.qualityCheckIntervalId) {
      // Initial check
      checkAndSet();

      // Re-check every 15 seconds
      this.qualityCheckIntervalId = setInterval(checkAndSet, 15000);
    }
  }

}