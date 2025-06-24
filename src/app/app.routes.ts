import { Router, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './login/sign-in/sign-in.component';
import { ForgetPasswordComponent } from './login/forget-password/forget-password.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { CoreComponent } from './core/core.component';
import { authGuard } from './guards/auth.guard';
import { ImprintComponent } from './imprint/imprint.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { VideoPlayerComponent } from './shared/components/video-player/video-player.component';

export const routes: Routes = [
    {
        path: '', component: LoginComponent, children: [
            { path: 'login', component: SignInComponent },
            { path: 'forget', component: ForgetPasswordComponent },
            { path: 'signUp', component: SignUpComponent },
            { path: 'resetPassword/:token', component: ResetPasswordComponent },
        ]
    },
    { path: 'imprint', component: ImprintComponent},
    { path: 'privacy', component: PrivacyComponent},
    { path: 'main', component: CoreComponent, canActivate: [authGuard]},
    { path: 'video', component: VideoPlayerComponent, canActivate: [authGuard]},
    { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
