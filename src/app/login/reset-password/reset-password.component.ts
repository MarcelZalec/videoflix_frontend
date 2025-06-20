import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LittleHelpersService } from '../../shared/services/little-helpers.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  reset:FormGroup;

  /**
   * Initializes the component and defines the reactive form for password input.
   *
   * @param {Router} router - Angular router for navigation.
   * @param {FormBuilder} fb - Form builder service to create the password reset form.
   * @param {LittleHelpersService} lh - UI helper service for showing toast notifications.
   * @param {AuthService} as - Service handling authentication-related API calls.
   * @param {ActivatedRoute} route - Provides access to route parameters like the reset token.
   */
  constructor(
    private router: Router,
    private fb: FormBuilder,
    public lh: LittleHelpersService,
    private as: AuthService,
    private route: ActivatedRoute
  ) {
    this.reset = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
      password2: ['', [Validators.required, Validators.minLength(4)]]
    })
  }


  /**
   * Handles password reset logic using the token from the URL.
   * Validates password fields, displays toast messages, and triggers navigation upon success.
   *
   * @returns {Promise<void>}
   */
  async resetPass() {
    let token;
    this.route.params.subscribe((p:any) => {
      token = p.token;
    })
    if (this.reset.value.password !== this.reset.value.password2) {
      this.lh.showToastSignal("Passwords must match")
    }
    if (token && this.reset.value.password === this.reset.value.password2) {
      await this.as.resetPassword(token, this.reset.value.password);
      this.reset.reset()
      this.router.navigateByUrl('login')
    }
  }
}
