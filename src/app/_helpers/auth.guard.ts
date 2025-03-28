import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '../_services';

export const authGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const accountService = inject(AccountService);
    
    const account = accountService.accountValue;
    if (account) {
        // check if route is restricted by role
        if (route.data['roles'] && !route.data['roles'].includes(account.role)) {
            // role not authorized so redirect to home page
            router.navigate(['/']);
            return false;
        }

        // authorized so return true
        return true;
    }

    // not logged in so redirect to login page with the return url
    router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
    return false;
};
