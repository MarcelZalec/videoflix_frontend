import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { DatabaseService } from '../shared/services/database.service';
import { ComunicationService } from '../shared/services/comunication.service';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { LittleHelpersService } from '../shared/services/little-helpers.service';

@Component({
  selector: 'app-core',
  imports: [
    CommonModule,
    FooterComponent,
    HeaderComponent,
  ],
  templateUrl: './core.component.html',
  styleUrl: './core.component.scss'
})
/**
 * Component responsible for displaying categorized videos, latest uploads, and managing
 * user interaction with the video interface.
 * 
 * Handles logic for video organization, scroll-based UI animation, responsive design,
 * and dynamic video detail loading.
 */
export class CoreComponent implements OnInit, OnDestroy {
  videos:any[] = [];
  latestVideos:any[] = [];
  categorys:string[] = [];
  videoSource:string | null = '';
  imgSource:string | null = '';
  currentE:any = null;
  all_categorys!:any[];
  private scrollEventListener!: (event: any) => void;
  headerAnimationClass = '';
  private lastScrollTop = 0;
  private scrollTimeout: any;
  mobile = false;
  videoDetail = false;

  /**
   * Initializes services and binds scroll behavior.
   * Also triggers initial video data load.
   */
  constructor(
    private dbs: DatabaseService,
    private router:Router,
    private com: ComunicationService,
    private lh: LittleHelpersService,
  ){
    this.getVideoDetails();
    this.scrollEventListener = this.onScroll.bind(this);
  }

  /**
   * Lifecycle hook: Sets up video categories, scroll listener, and mobile detection.
   */
  ngOnInit(): void {
    this.videos = [];
    this.categorys = [];
    this.dbs.loadVideos();
    window.addEventListener('scroll', this.scrollEventListener);
    this.setMobile()
  }

  /**
   * Lifecycle hook: Cleans up scroll listener on destroy.
   */
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollEventListener);
  }

  /**
   * Scroll event logic placeholder for potential future enhancements.
   */
  onScroll(event: Event): void {
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 200 && window.innerWidth > 500) {
      // this.clearStartVideo();
    } else {
      return
    }
  }

  /**
   * Subscribes to video stream and organizes them by category.
   */
  getVideoDetails(){
    this.dbs.videos$.subscribe((v) => {
      v.forEach((obj) => {
        let data = {
          id:obj.id,
          title:obj.title,
          thumbnail:obj.thumbnail,
          category:obj.category,
          video:obj.video_file,
          description:obj.description,
          created_at:obj.created_at,
        }
        if (!this.all_categorys) {
          this.all_categorys = [];
        }
        let catGroup = this.all_categorys.find(group => group.category === obj.category);
        if (catGroup) {
          if (catGroup.videos.length > 0) {
            if (catGroup.videos.find((video: any) => video.id === obj.id)) {
              return
            } else {
              catGroup.videos.push(data);
            }
          }
        } else {
          this.all_categorys.push({ category: obj.category, videos: [data] });
        }
        this.setLatestVideos()
      })
    })
  }

  /**
   * Activates a selected video and navigates to its detail page.
   */
  setActiveVideo(id:number){
    this.com.setactiveVideo(id)
    this.router.navigateByUrl('video')
  }

  /**
   * Resets the preview video data to default.
   */
  clearStartVideo() {
    this.videoSource = '';
    this.imgSource = '';
    this.currentE = null;
    this.setStartVideo()
  }

  /**
   * Finds the index of a video within all categorized videos.
   *
   * @param {number} id - The video ID to search for.
   * @returns {object | null} - Category and video indices or null if not found.
   */
  find(id: number): { categoryIndex: number, videoIndex: number } | null {
    if (!this.all_categorys) return null;
    for (let categoryIndex = 0; categoryIndex < this.all_categorys.length; categoryIndex++) {
      const videoIndex = this.all_categorys[categoryIndex].videos.findIndex((v: any) => v.id === id);
      if (videoIndex !== -1) {
        return { categoryIndex, videoIndex };
      }
    }
    return null;
  }

  /**
   * Sets the preview video using the provided video ID or a default fallback.
   *
   * @param {number} [id] - Optional ID of the video to show in preview.
   */
  setStartVideo(id?: number) {
    const videoElement = document.getElementById("backgroundVideo") as HTMLVideoElement;
    if (videoElement) {
      videoElement.muted = true;
      videoElement.autoplay = true;
    }
    if (id && this.all_categorys) {
      const found = this.find(id);
      if (found) {
        const videoObj = this.all_categorys[found.categoryIndex].videos[found.videoIndex];
        this.imgSource = videoObj.thumbnail;
        this.currentE = videoObj;
        // this.videoSource = this.com.setVideoPath(videoObj.video, false); // funktioniert weiß nur nicht ob ich das so mache
        return;
      }
    } else {
      this.setDefaultSourceOrStartup()
    }
  }

  /**
   * Set the first element or the default fallback
   */
  setDefaultSourceOrStartup() {
    if (this.all_categorys && this.all_categorys.length > 0) {
      const videoObj = this.all_categorys[0].videos[0];
      this.imgSource = videoObj.thumbnail;
      this.currentE = videoObj;
    } else {
      this.imgSource = '';
      this.videoSource = '';
      this.currentE = null;
    }
  }


  /**
   * Updates the list of the latest 6 videos uploaded within the last 48 hours.
   */
  setLatestVideos() {
    this.all_categorys.forEach(e => {
      for (let i = 0; i < e.videos.length; i++) {
        e.videos[i].created_at = e.videos[i].created_at || new Date().toISOString(); // Sicherstellen, dass created_at gesetzt ist
        if (this.checkLast48Hours(e.videos[i].created_at)) {
          e.videos.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          this.latestVideos.push(e.videos[i]);
        }
        this.latestVideos = this.latestVideos.filter((video, index, self) =>
          index === self.findIndex((v) => v.id === video.id)
        ); // Duplikate entfernen
      }
      this.latestVideos.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      this.latestVideos = this.latestVideos.slice(0, 6); // Begrenze auf die neuesten 6 Videos
    })
    this.setStartVideo();
  }

  /**
   * Checks whether a video was uploaded within the last 48 hours.
   *
   * @param {string | number | Date} time - Timestamp to compare.
   * @returns {boolean} - True if within 48 hours, false otherwise.
   */
  checkLast48Hours(time: string | number | Date): boolean {
    const now = Date.now();
    const videoTime = new Date(time).getTime();
    const diff = now - videoTime;
    if (diff <= 48 * 60 * 60 * 1000 && diff >= 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Tracks scroll direction to animate header elements accordingly.
   */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      this.headerAnimationClass = scrollTop > this.lastScrollTop
        ? 'scroll_animation_header_down'
        : 'scroll_animation_header_up';

      this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, 100); // <— debounce-Zeit in Millisekunden (hier 100ms)
  }

  /**
   * Displays detailed view of a selected video.
   *
   * @param {number} id - ID of the video to show in detail.
   */
  VideoDetailOpen(id: number) {
    this.videoDetail = true;
    this.com.setactiveVideo(id);
    const found = this.find(id);
    if (found) {
      const videoObj = this.all_categorys[found.categoryIndex].videos[found.videoIndex];
      this.imgSource = videoObj.thumbnail;
      this.currentE = videoObj;
      this.videoSource = '';
    }
  }

  /**
   * Determines whether to apply mobile layout styles.
   */
  setMobile() {
    this.mobile = window.innerWidth < 700;
  }

  /** Gets the current video source from the communication service. */
  get currentSource() {
    return this.com.currentSource
  }

  /** Gets the current screen width using the helper service. */
  get screenwidth() {
    return this.lh.checkScreenWith()
  }

  /** Gets the currently selected video object from the communication service. */
  get currentElement() {
    return this.com.currentElement;
  }

}