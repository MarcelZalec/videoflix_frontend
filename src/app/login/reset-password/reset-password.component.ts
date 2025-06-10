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


  resetPass() {
    let token;
    this.route.params.subscribe((p:any) => {
      token = p.token;
    })
    if (this.reset.value.password !== this.reset.value.password2) {
      this.lh.showToastSignal("Passwords must match")
    }
    if (token && this.reset.value.password === this.reset.value.password2) {
      this.as.resetPassword(token, this.reset.value.password);
    }
  }
}
