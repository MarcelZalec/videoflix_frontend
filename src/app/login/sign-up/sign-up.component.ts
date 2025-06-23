import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LittleHelpersService } from '../../shared/services/little-helpers.service';
import { SignupModel } from '../../shared/models/login.model';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  signUpForm:FormGroup;

  /**
   * Initializes the form with email and password fields and sets email if available in sessionStorage.
   * 
   * @param {FormBuilder} fb - Form builder used to construct the form group.
   * @param {LittleHelpersService} lh - Helper service for displaying UI feedback (e.g., toast messages).
   * @param {AuthService} as - Service responsible for authentication API interactions.
   */
  constructor(
    private fb: FormBuilder,
    public lh: LittleHelpersService,
    private as: AuthService
  ) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      password2: ['', [Validators.required, Validators.minLength(4)]]
    })
    this.tryToSetEmail()
  }

  /**
   * Attempts to prefill the email field from sessionStorage if available.
   */
  tryToSetEmail(){
    let m = sessionStorage.getItem('email')
    if (m !== '') {
      this.signUpForm.patchValue({email: m})
    } else {
      return
    }
  }

  /**
   * Registers a new user using the form data.
   * Provides feedback based on form validity and API responses.
   *
   * @returns {Promise<void>}
   */
  async register(){
    try {
      let user= new SignupModel(
        this.signUpForm.value.username,
        this.signUpForm.value.email,
        this.signUpForm.value.password,
        this.signUpForm.value.password2
      )
      if (!this.signUpForm.valid) {
        this.lh.showToastSignal('You must fill all fields')
      } else if (this.signUpForm.valid && this.signUpForm.value.password == this.signUpForm.value.password2) {
        await lastValueFrom(this.as.register(user))
        this.signUpForm.reset()
      } else if(this.signUpForm.value.password != this.signUpForm.value.password2){
        this.lh.showToastSignal("Passwords do not match!")
      } else return
    } catch (e:any) {
      if (e) {
        this.lh.showToastSignal(`${e.error['email'][0]}`)
      } else {
        this.lh.showToastSignal(`Form not valid`)
      }
    }
  }
}
