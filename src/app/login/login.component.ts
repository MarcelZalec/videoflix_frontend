import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { ToastmsgComponent } from '../shared/c/toastmsg/toastmsg.component';
import { LittleHelpersService } from '../shared/services/little-helpers.service';
import { FooterComponent } from '../shared/c/footer/footer.component';
import { HeaderComponent } from '../shared/c/header/header.component';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterOutlet, ReactiveFormsModule, ToastmsgComponent, FooterComponent, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  startpage:boolean = false;
  errorMessage:boolean = false;
  startForm:FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private lh: LittleHelpersService,
    private as: AuthService,
  ) {
    this.startForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  ngOnInit(): void {
    if (this.router.url === '/'){
          this.startpage = true; 
        }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.router.url === '/'){
          this.startpage = true;
        } else {
          this.startpage = false;
        }
      }
    })

    if (this.as.autoLogin()) {
      this.router.navigateByUrl('main')
    }
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

  get toastMessage() {
    return this.lh.toastSignal()
  }
}