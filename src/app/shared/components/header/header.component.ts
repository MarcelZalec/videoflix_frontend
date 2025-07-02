import { CommonModule, NgClass } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ComunicationService } from '../../services/comunication.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  /**
  * Optional input property to specify the page identifier.
  * This can be used to adjust component behavior or display based on the provided value.
  */
  @Input() page:string = '';
  loginPage:boolean = false;
  mainMenu:boolean = false;
  title:string = ''
  screenWidth!:number;

  /**
   * Initializes router, authentication, and communication services, and retrieves screen width.
   *
   * @param {Router} router - Angular router for navigation tracking.
   * @param {AuthService} as - Service used for logging out the user.
   * @param {ComunicationService} com - Service providing shared data like selected video.
   */
  constructor(
    private router: Router,
    private as: AuthService,
    private com: ComunicationService,
  ) {
    this.checkScreenWith();
  }

  /**
   * Lifecycle hook that runs after component initialization.
   * Sets view flags based on the current route and fetches the appropriate title.
   */
  ngOnInit(): void {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (this.router.url === '/login') {
            this.loginPage = true;
            this.mainMenu = false;
          } else if (this.router.url === '/main') {
            this.loginPage = false;
            this.mainMenu = true;
          } else {
            this.loginPage = false;
            this.mainMenu = false;
          }
        }
      })
      this.setTitle();
  }

  /**
   * Navigates to the login screen.
   */
  goToLogin() {
    this.router.navigateByUrl('login')
  }

  /**
   * Navigates to the root path ('/').
   */
  goToRootPath() {
    if (sessionStorage.getItem('token')) {
      this.router.navigateByUrl('main')
    } else {
      this.router.navigateByUrl('')
    }
  }

  /**
   * Navigates to the main menu screen.
   */
  goToMainMenu(){
    this.router.navigateByUrl('main')
  }

  /**
   * Logs the user out and redirects to the root path.
   */
  logout(){
    this.as.logout();
    this.goToRootPath();
  }

  /**
   * Sets the header title using the current video element or from session storage.
   */
  setTitle()  {
    if (this.com.currentElement) {
      this.title = this.com.currentElement.title
    } else if (this.title == '') {
      this.title = sessionStorage.getItem('title_video') as string
    }
  }

  /**
   * Detects and stores the width of the current screen.
   */
  checkScreenWith() {
    this.screenWidth = screen.width
  }
}
