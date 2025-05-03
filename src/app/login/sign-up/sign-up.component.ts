import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LittleHelpersService } from '../../shared/services/little-helpers.service';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  signUpForm:FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public lh: LittleHelpersService
  ) {
    this.signUpForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required]
    })
  }


  register(){}
}
