import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../_services';

export function authGuard() {
    const router = inject(Router);
    const accountService = inject(AccountService);
    const account = accountService.accountValue;

    if (account) {
        return true;
    }

    // not logged in so redirect to login page with the return url
    router.navigate(['/account/login']);
    return false;
} 