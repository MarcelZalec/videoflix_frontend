import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { lastValueFrom } from 'rxjs';
import { LittleHelpersService } from '../../shared/services/little-helpers.service';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  forgotForm:FormGroup;

  /**
   * Initializes the component and the form group with validation for the email field.
   *
   * @param {Router} router - Angular router for navigation.
   * @param {FormBuilder} fb - Form builder for constructing the reactive form.
   * @param {AuthService} as - Authentication service for handling API requests.
   * @param {LittleHelpersService} lh - Helper service for UI feedback (e.g. toast notifications).
   */
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private as: AuthService,
    private lh: LittleHelpersService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }

  /**
   * Sends a password reset email if the form is valid.
   * Provides user feedback via toast notifications based on the server response.
   *
   * @returns {Promise<void>}
   */
  async sendMail(){
    if (this.forgotForm.valid) {
      try {
        const response = await this.as.forgetPass(this.forgotForm.value.email);
        if (response.status == 200) {
          this.lh.showToastSignal('Email sent successfully.')
        } else {
          this.lh.showToastSignal('Error sending email.')
        }
      } catch (error) {
        this.lh.showToastSignal('An unexpected error occurred. Please try again.')
      }
    } else {
      this.lh.showToastSignal('Please enter a valid email address.')
    }
  }

}
