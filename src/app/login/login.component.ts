import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { ToastmsgComponent } from '../shared/components/toastmsg/toastmsg.component';
import { LittleHelpersService } from '../shared/services/little-helpers.service';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { HeaderComponent } from '../shared/components/header/header.component';
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

  /**
   * Initializes the component and the form used to collect user's email.
   * 
   * @param {Router} router - Angular Router for navigation.
   * @param {FormBuilder} fb - Reactive form builder.
   * @param {LittleHelpersService} lh - UI utility service for toast feedback.
   * @param {AuthService} as - Service for authentication methods including auto-login.
   * @param {Renderer2} renderer - Renderer for dynamic DOM styling.
   */
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

  /**
   * Lifecycle hook that runs after component initialization.
   * Determines the current route and sets background imagery based on route state.
   * Automatically redirects to main page if already authenticated.
   */
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

  /**
   * Lifecycle hook that runs after the view is initialized.
   * Ensures the correct background image is applied.
   */
  ngAfterViewInit(): void {
    this.setBackgroundImage();
  }

  /**
   * Dynamically sets the background image based on current route state.
   */
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

  /**
   * Navigates to the sign-up page after validating the email field.
   * Stores the email in sessionStorage to prefill the sign-up form.
   */
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

  /**
   * Navigates to the login page.
   */
  goToLogin() {
    this.router.navigateByUrl('login')
  }

  /**
   * Getter to expose the toast message observable from the helper service.
   * 
   * @returns {Observable<string>} - Observable for UI toast messages.
   */
  get toastMessage() {
    return this.lh.toastSignal()
  }
}