import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../_services';

export function adminGuard() {
    const router = inject(Router);
    const accountService = inject(AccountService);
    const account = accountService.accountValue;

    if (account?.role === 'Admin') {
        return true;
    }

    // not admin so redirect to home page
    router.navigate(['/']);
    return false;
} 