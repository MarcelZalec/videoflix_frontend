import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LittleHelpersService } from '../../shared/services/little-helpers.service';

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
    public lh: LittleHelpersService
  ) {
    this.reset = this.fb.group({
      password: ['', Validators.required],
      password2: ['', Validators.required]
    })
  }


  resetPass(){}
}
