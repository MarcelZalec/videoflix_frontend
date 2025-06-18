import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { ToastmsgComponent } from '../shared/c/toastmsg/toastmsg.component';
import { LittleHelpersService } from '../shared/services/little-helpers.service';
import { FooterComponent } from '../shared/c/footer/footer.component';
import { HeaderComponent } from '../shared/c/header/header.component';
import { AuthService } from '../shared/services/auth.service';
import { set } from 'video.js/dist/types/tech/middleware';

@Component({
  selector: 'app-login',
  imports: [RouterOutlet, ReactiveFormsModule, ToastmsgComponent, FooterComponent, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  @ViewChild('loginBody') bodyRef!: ElementRef
  startpage:boolean = false;
  errorMessage:boolean = false;
  startForm:FormGroup;
  signUp: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private lh: LittleHelpersService,
    private as: AuthService,
    private renderer: Renderer2
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
        const url = event.urlAfterRedirects;
        if (url === '/'){
          this.startpage = true;
        } else if (url === '/signUp') {
          this.signUp = true;
          this.startpage = false;
        } else {
          this.startpage = false;
          this.signUp = false;
        }
        this.setBackgroundImage();
      }   
    })

    if (this.as.autoLogin()) {
      this.router.navigateByUrl('main')
    }
  }

  ngAfterViewInit(): void {
    this.setBackgroundImage();
  }

  setBackgroundImage() {
    if (this.bodyRef) {
      let backgroundImage = 'url(/img/0f3b0b3833031bc99687aa3a9f9377f5bacdb640.jpg)';
      if (this.startpage) {
        backgroundImage = 'url(/img/pic3.jpg)';
      } else if (this.signUp) {
        backgroundImage = 'url(/img/pic2.jpg)';
      }
      this.renderer.setStyle(this.bodyRef.nativeElement, 'background-image', backgroundImage);
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