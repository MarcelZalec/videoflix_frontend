import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { ToastmsgComponent } from '../shared/c/toastmsg/toastmsg.component';
import { LittleHelpersService } from '../shared/services/little-helpers.service';

@Component({
  selector: 'app-login',
  imports: [RouterOutlet, NgClass, ReactiveFormsModule, ToastmsgComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginPage:boolean = false;
  startpage:boolean = true;
  errorMessage:boolean = false;
  startForm:FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private lh: LittleHelpersService
  ) {
    this.checkside();
    this.startForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  goToSignUp(){
    if(this.startForm.valid) {
      this.errorMessage = false;
      sessionStorage.setItem('email', this.startForm.get('email')?.value)
      this.router.navigateByUrl('signUp')
    } else {
      this.lh.showToastSignal('E-Mail not valid')
      this.errorMessage = true;
    }
  }

  goToLogin() {
    this.router.navigateByUrl('login')
  }

  goToRootPath() {
    this.router.navigateByUrl('')
  }

  /**
  * Checks the current route and updates the page flags accordingly.
  */
  checkside() {
    setInterval(() => {
      if (this.router.routerState.snapshot.url == '/login') {
        this.loginPage = true;
        this.startpage = false
      } else {
        if (this.router.routerState.snapshot.url == '/') {
          this.startpage = true;
        } else {
          this.startpage = false;
        }
        this.loginPage = false;
      }
    },100)
  }

  get toastMessage() {
    return this.lh.toastSignal()
  }
}