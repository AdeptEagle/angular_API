import { APP_INITIALIZER } from '@angular/core';
import { AccountService } from '../_services';

export function appInitializer(accountService: AccountService) {
    return () => new Promise<void>(resolve => {
        // attempt to refresh token on app start up to auto authenticate
        accountService.refreshToken()
            .subscribe()
            .add(() => resolve());
    });
}

export const appInitializerProvider = {
    provide: APP_INITIALIZER,
    useFactory: appInitializer,
    multi: true,
    deps: [AccountService]
};
