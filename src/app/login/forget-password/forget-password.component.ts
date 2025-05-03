import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  forgotForm:FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {
    this.forgotForm = this.fb.group({
      email: ['', Validators.required],
    })
  }


  sendMail(){}

}
