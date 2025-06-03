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
  @Input() page:string = '';
  loginPage:boolean = false;
  mainMenu:boolean = false;
  title:string = ''

  constructor(
    private router: Router,
    private as: AuthService,
    private com: ComunicationService,
  ) {}

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

  goToLogin() {
    this.router.navigateByUrl('login')
  }

  goToRootPath() {
    this.router.navigateByUrl('')
  }

  goToMainMenu(){
    this.router.navigateByUrl('main')
  }

  logout(){
    this.as.logout();
    this.goToRootPath();
  }

  setTitle()  {
    if (this.com.currentElement) {
      this.title = this.com.currentElement.title
    } else if (this.title == '') {
      this.title = sessionStorage.getItem('title_video') as string
    }
  }
}
