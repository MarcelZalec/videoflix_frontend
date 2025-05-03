import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LittleHelpersService } from '../../shared/services/little-helpers.service';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  signInForm:FormGroup;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    public lh: LittleHelpersService
  ) {
    this.signInForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  login() {
    if(this.signInForm.valid)
      console.log("valide")
    else
      console.log("invalide")
  }

  loginF() {
    this.router.navigateByUrl('main')
  }

  goToForgetPassword() {
    this.router.navigateByUrl('forget')
  }

  goToSignUp() {
    this.router.navigateByUrl('signUp')
  }
}
