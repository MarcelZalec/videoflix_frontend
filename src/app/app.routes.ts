import { Router, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './login/sign-in/sign-in.component';
import { ForgetPasswordComponent } from './login/forget-password/forget-password.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { MainComponent } from './main/main.component';

export const routes: Routes = [
    {
        path: '', component: LoginComponent, children: [
            { path: '', component: SignInComponent },
            { path: 'login', component: SignInComponent },
            { path: 'forget', component: ForgetPasswordComponent },
            { path: 'signUp', component: SignUpComponent },
            { path: 'resetPassword', component: ResetPasswordComponent },
        ]
    },
    { path: 'main', component: MainComponent}
];
