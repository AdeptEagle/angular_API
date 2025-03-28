import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Role } from './_models';
import { authGuard } from './_helpers/auth.guard';

const routes: Routes = [
    { 
        path: '', 
        loadComponent: () => import('./home/home.component').then(x => x.HomeComponent),
        canActivate: [authGuard]
    },
    { 
        path: 'account', 
        loadChildren: () => import('./account/account.routes').then(x => x.ACCOUNT_ROUTES)
    },
    { 
        path: 'profile', 
        loadComponent: () => import('./profile/profile.component').then(x => x.ProfileComponent),
        canActivate: [authGuard]
    },
    { 
        path: 'admin', 
        loadChildren: () => import('./admin/admin.routes').then(x => x.ADMIN_ROUTES),
        canActivate: [authGuard],
        data: { roles: [Role.Admin] }
    },
    { 
        path: '**', 
        redirectTo: '' 
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}