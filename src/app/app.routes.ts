import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './account/login.component';
import { RegisterComponent } from './account/register.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './_guards/auth.guard';
import { adminGuard } from './_guards/admin.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'account/login', component: LoginComponent },
    { path: 'account/register', component: RegisterComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { 
        path: 'admin', 
        loadChildren: () => import('./admin/admin.routes').then(m => m.routes),
        canActivate: [adminGuard]
    },
    { path: '**', redirectTo: '' }
]; 