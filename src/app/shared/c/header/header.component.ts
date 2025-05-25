import { CommonModule, NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    private router: Router,
    private as: AuthService,
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

}
