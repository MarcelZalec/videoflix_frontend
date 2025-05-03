import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterOutlet, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginPage:boolean = false

  constructor(
    private router: Router
  ){
    this.checkside();
  }

  goToLogin() {
    this.router.navigateByUrl('login')
  }

  /**
  * Checks the current route and updates the page flags accordingly.
  */
  checkside() {
    setInterval(() => {
      if (this.router.routerState.snapshot.url == '/login') {
        this.loginPage = true;
      } else {
        this.loginPage = false;
      }
    },100)
  }

  goToRootPath() {
    this.router.navigateByUrl('')
  }

}