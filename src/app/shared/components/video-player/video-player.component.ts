import { Component, ElementRef, Input, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import videojs from 'video.js'
import { ComunicationService } from '../../services/comunication.service';
import Player from 'video.js/dist/types/player';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import * as VPC from './video-player-code';

@Component({
  selector: 'app-video-player',
  imports: [HeaderComponent, CommonModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent implements OnDestroy, AfterViewInit {
  /**
   * Reference to the native video DOM element.
   */
  @ViewChild('target', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  /**
   * Input options including the list of video sources and configuration.
   */
  @Input() videoOptions!: { sources: { src: string; type: string }[] };
  private mouseMoveListener!: (event: MouseEvent) => void;
  private touchMoveListener!: (event: TouchEvent) => void;
  private timeoutId: number | undefined;
  player!: Player;// videojs.Player; 
  element:any;
  currentSource = '';
  showQualityPicker = false;
  currentQuality = '720'; // Default quality
  showMobile = 0;
  videoStarted = false;

  /**
   * Injects communication service to access video context.
   *
   * @param {ComunicationService} com - Service for sharing video data across components.
   */
  constructor(
    private com: ComunicationService,
  ){
    this.getActiveVideo();
  }

  /**
   * Lifecycle hook: After view initialization, sets up player, user interaction listeners,
   * and restores playback state from storage.
   */
  ngAfterViewInit(): void {
    this.checkStorage();

    if (window.innerWidth < 700) {
      this.touchMoveListener = (event: TouchEvent) => {
        this.showHeader(true)
      }
      document.addEventListener('touchend', this.touchMoveListener)
    } else {
      this.mouseMoveListener = (event: MouseEvent) => {
        this.showHeader()
      }
      document.addEventListener('mousemove', this.mouseMoveListener)
    }

    this.initializePlayer();
  }

  /**
   * Initializes the Video.js player and attaches event listeners for playback and volume changes.
   */
  private initializePlayer(): void {
    if (this.videoElement && this.videoElement.nativeElement) {
      const controlBarOptions = VPC.setUpControles();

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
        controlBar: controlBarOptions,
      })

      this.player.on('play', ()=> {
        if (!this.videoStarted) {
          this.videoStarted = true;
        }
      })
      this.player.on('pause', ()=> {})

      this.player.on('ended', function() {

      });

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

  /**
   * Lifecycle hook: Removes listeners and cleans up player instance.
   */
  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.mouseMoveListener)
    document.removeEventListener('touchmove', this.touchMoveListener)
    this.setAndGetCurrentTime();
    if (this.player) {
      this.player.dispose();
    }
    sessionStorage.removeItem('current_video')
    sessionStorage.removeItem('title_video')
  }

  /**
   * Retrieves current video data from communication service or sessionStorage.
   */
  getActiveVideo(){
    this.element = this.com.currentElement;
    if (!this.element) {
      this.element = sessionStorage.getItem('current_element_thumbnail') || '';
    } else {
      sessionStorage.setItem('current_element_thumbnail', this.element.thumbnail);
    }
    this.currentSource = this.com.currentSource;
  }

  /**
   * Manages visibility of header and control overlays based on user interaction.
   *
   * @param {boolean} mobile - Whether to apply mobile-specific behavior.
   */
  showHeader(mobile:boolean = false): void {
    const obj = [
      document.getElementById('head'),
      document.getElementById('qualitySymbol'),
    ] as HTMLElement[];
    if (document.getElementById('mobileControles')) {
      obj.push(document.getElementById('mobileControles')!);
    }
    if (obj && obj.length > 0) {
      if (!mobile || this.showMobile === 0) {
        obj.forEach(el => {
          el.classList.remove('fadeOut'); // Entfernt die Ausblend-Animation
          el.classList.add('fadeIn'); // Fügt die Einblend-Animation hinzu
        });
        if (mobile) {
          this.showMobile = 1;
          return;
        }
      }

      // Falls bereits ein Timeout läuft, abbrechen
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      // Nach 2 Sekunden wieder ausblenden wenn nicht mobil
      if (mobile && this.showMobile === 1) {
        // Auf mobilen Geräten wird die Header-Leiste nicht ausgeblendet
        this.timeoutId = undefined; // Setzt das Timeout zurück, damit es nicht ausgeführt wird
        obj.forEach(el => {
          el.classList.remove('fadeIn'); // Entfernt die Einblend-Animation
          el.classList.add('fadeOut'); // Fügt die Ausblend-Animation hinzu
        });
        this.showMobile = 0;
        return;
      }else if (!mobile) {
        this.timeoutId = window.setTimeout(() => {
          obj.forEach(el => {
            el.classList.remove('fadeIn'); // Entfernt die Einblend-Animation
            el.classList.add('fadeOut'); // Fügt die Ausblend-Animation hinzu
          });
        }, 2000);
      }
    }
  }

  /**
   * Loads the last watched video source from session storage if available.
   */
  checkStorage() {
    let video = sessionStorage.getItem('current_video')
    if (video !== null) {
      this.currentSource = video
    }
  }

  /**
   * Saves or restores playback time, depending on the `get` flag.
   *
   * @param {boolean} get - If true, saves time; otherwise, restores it.
   */
  setAndGetCurrentTime(get:boolean = true) {
    let time = this.player.currentTime()
    if (get && time) {
      let strTime = time.toString()
      // sessionStorage.setItem('current_time_video', strTime)
    } else {
      let t = sessionStorage.getItem('current_time_video') || 0
      this.player.currentTime(`${t}`)
    }
  }

  /**
   * Toggles visibility of the quality picker and attaches outside click/touch listeners.
   */
  toggleQualityPicker() {
    let mobile = window.innerWidth < 700;
    const qualityPicker = document.getElementById('qualityPicker');
    if (qualityPicker) {
      qualityPicker.classList.toggle('d-none');
      this.showQualityPicker = !this.showQualityPicker;
      this.setListeners(mobile);
    }
  }

  /**
   * Sets up event listeners for closing the quality picker when clicking or touching outside.
   *
   * @param {boolean} mobile - Determines the event type to bind.
   */
  setListeners(mobile: boolean) {
    if (this.showQualityPicker && !mobile) {
      setTimeout(() => {
        document.addEventListener('mousedown', this.handleOutsideClick);
        document.getElementById('qualityBackground')?.classList.toggle('d-none');
      });
    } else if(this.showQualityPicker &&  mobile) {
      setTimeout(() => {
        document.addEventListener('touchend', this.handleOutsideTouch);
        document.getElementById('qualityBackground')?.classList.toggle('d-none');
      });
    } else {
      document.removeEventListener('touchend', this.handleOutsideTouch);
      document.removeEventListener('mousedown', this.handleOutsideClick);
    }
  }

  /**
   * Handles clicks outside the quality picker to close it.
   */
  private handleOutsideClick = (event: MouseEvent) => {
    const qualityPicker = document.getElementById('qualityPicker');
    if (qualityPicker && !qualityPicker.contains(event.target as Node)) {
      qualityPicker.classList.add('d-none');
      this.showQualityPicker = false;
      document.removeEventListener('mousedown', this.handleOutsideClick);
    }
  }

  /**
   * Handles touches outside the quality picker to close it.
   */
  private handleOutsideTouch = (event: TouchEvent) => {
    const qualityPicker = document.getElementById('qualityPicker');
    if (qualityPicker && !qualityPicker.contains(event.target as Node)) {
      qualityPicker.classList.add('d-none');
      this.showQualityPicker = false;
      document.removeEventListener('touchend', this.handleOutsideTouch);
    }
  }

  /**
   * Changes the video quality by altering the source URL and preserving playback time.
   *
   * @param {string} quality - Desired video quality (e.g., '1080').
   * @param {boolean} manual - Indicates whether the change is user-initiated.
   */
  changeQality(quality: string, manual: boolean = true) {
    if (manual) {
      if (this.qualityCheckIntervalId) {
        clearInterval(this.qualityCheckIntervalId);
        this.qualityCheckIntervalId = null;
      }
    }
    document.getElementById('qualityBackground')?.classList.toggle('d-none');
    let playTime = this.player.currentTime()
    const source = this.currentSource;
    if (source && playTime) {
      this.setSourceWithOtherQuality(source, playTime, quality);
    }
  }

  /**
   * Replaces the current video source with the same video at a different quality level,
   * seeking to the previous play time.
   *
   * @param {string} source - The current video source URL.
   * @param {number} playTime - The time (in seconds) to seek after switching quality.
   * @param {string} quality - The desired quality level (e.g., '720').
   */
  setSourceWithOtherQuality(source: string, playTime: number, quality: string) {
    this.currentQuality = quality;
    const newSrc = source.replace(/_\d{3,4}p/, `_${quality}p`); // Replace any _[3 or 4 digits]p with the new quality
    sessionStorage.setItem('current_video', newSrc);
    this.player.src(newSrc);
    this.player.load();
    this.player.currentTime(playTime);
    this.player.play();
  }

  private qualityCheckIntervalId: any = null;

  /**
   * Periodically checks internet speed using a lightweight image and adjusts video quality accordingly.
   * Designed to balance video resolution with user bandwidth without interrupting playback.
   */
  checkInternetSpeedAndSetQuality() {
    // Define quality thresholds in Mbps
    const qualityMap = [
      { quality: '1080', minSpeed: 8 },
      { quality: '720', minSpeed: 4 },
      { quality: '480', minSpeed: 2 },
      { quality: '360', minSpeed: 1 },
      { quality: '240', minSpeed: 0 }
    ];

    // The image should be as small as possible (ideally < 5KB) to ensure the speed test is quick and doesn't impact user experience.
    // A 1x1 or 10x10 pixel JPEG or PNG is typical. Avoid large images.
    const testImage = 'http://127.0.0.1:8000/media/test.png'; // Small image for speed test
    const imageSizeBytes = 222; // Approximate size of the image in bytes

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
            this.changeQality(q.quality, false);
          }
          break;
        }
      }
    };

    const checkAndSet = async () => {
      console.log('Checking internet speed...');
      const speed = await measureSpeed();
      console.log(`Measured speed: ${speed.toFixed(2)} Mbps`);
      setQualityBySpeed(speed);
    };

    // Only start interval if not already running
    if (!this.qualityCheckIntervalId) {
      checkAndSet();
      this.qualityCheckIntervalId = setInterval(checkAndSet, 15000);
    }
  }

  /**
   * Toggles play and pause state from a mobile-optimized control and updates UI classes accordingly.
   */
  togglePlayPause_mobile() {
    document.getElementById('playerSate_mobile')?.classList.toggle('custom_play_button');
    document.getElementById('playerSate_mobile')?.classList.toggle('custom_pause_button');
    if (this.player.paused()) {
      this.player.play();
      setTimeout(() => {
        this.showHeader(true);
      }, 1000);
    } else {
      this.player.pause();
    }
  }

  /**
   * Prevents event propagation for nested touch events (e.g. to keep controls responsive on mobile).
   *
   * @param {TouchEvent} event - The incoming touch event.
   */
  sP(event: TouchEvent) {
    event.stopPropagation();
  }

  /**
   * Seeks the video playback 10 seconds forward or backward.
   *
   * @param {'forward' | 'backward'} way - Direction of skipping in the video timeline.
   */
  videoForOrBackward(way: 'forward' | 'backward') {
    const currentTime = this.player.currentTime() || 0;
    const newTime = way === 'forward' ? currentTime + 10 : currentTime - 10;
    if (newTime < 10) {
      this.player.currentTime(0)// Prevent seeking to negative time
    }
    this.player.currentTime(newTime);
    // this.setAndGetCurrentTime(false);
  }

  /**
   * Getter for current screen width.
   *
   * @returns {number} - Width of the browser window in pixels.
   */
  get screenwidth() {
    return window.innerWidth;
  }
}