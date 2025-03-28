import { Routes } from '@angular/router';

export const ACCOUNT_ROUTES: Routes = [
    { 
        path: 'login', 
        loadComponent: () => import('./login.component').then(x => x.LoginComponent)
    },
    { 
        path: 'register', 
        loadComponent: () => import('./register.component').then(x => x.RegisterComponent)
    },
    { 
        path: 'verify-email', 
        loadComponent: () => import('./verify-email.component').then(x => x.VerifyEmailComponent)
    },
    { 
        path: 'forgot-password', 
        loadComponent: () => import('./forgot-password.component').then(x => x.ForgotPasswordComponent)
    },
    { 
        path: 'reset-password', 
        loadComponent: () => import('./reset-password.component').then(x => x.ResetPasswordComponent)
    }
]; 