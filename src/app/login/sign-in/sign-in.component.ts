import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LittleHelpersService } from '../../shared/services/little-helpers.service';
import { AuthService } from '../../shared/services/auth.service';
import { lastValueFrom } from 'rxjs';
import { LoginModel } from '../../shared/models/login.model';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  signInForm:FormGroup;


  /**
   * Constructs the component and initializes the login form with validation rules.
   *
   * @param {Router} router - Used for route navigation.
   * @param {FormBuilder} fb - Builds the reactive login form.
   * @param {LittleHelpersService} lh - UI helper service for feedback (e.g., toast messages).
   * @param {AuthService} as - Service for handling authentication-related API calls.
   */
  constructor(
    private router: Router,
    private fb: FormBuilder,
    public lh: LittleHelpersService,
    private as: AuthService,
  ) {
    this.signInForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false]
    })
  }

  /**
   * Attempts to log the user in using form values.
   * If successful, navigates to the main page. Otherwise, shows feedback and resets the form.
   *
   * @returns {Promise<void>}
   */
  async login() {
    let user= new LoginModel(
      this.signInForm.value.email,
      this.signInForm.value.password,
      this.signInForm.value.remember = this.signInForm.value.remember || false,
    )
    if(!this.signInForm.valid) {
      this.lh.showToastSignal('Invalid Form all fields must be filled')
    }
    if(this.signInForm.valid){
      try {
        await lastValueFrom(this.as.login(user))
        this.router.navigateByUrl('main')
      } catch (error) {
        this.lh.showToastSignal('Invalid login credentials')
        this.lh.clearForm(this.signInForm)
      }
    }      
  }

  /**
   * Navigates to the "Forgot Password" screen.
   */
  goToForgetPassword() {
    this.router.navigateByUrl('forget')
  }

  /**
   * Navigates to the "Sign Up" screen.
   */
  goToSignUp() {
    this.router.navigateByUrl('signUp')
  }

  /**
   * Getter for observing the toast message signal from the helper service.
   *
   * @returns {Observable<string>} - Stream of toast messages.
   */
  get toastMessage() {
    return this.lh.toastSignal()
  }
}
