import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

import { AlertService } from '@app/_services/alert.service'; // Ensure correct import path
import { Role } from '@app/_models';

const accountsKey = 'angular-10-signup-verification-boilerplate-accounts';
let accounts: any[] = JSON.parse(localStorage.getItem(accountsKey) || '[]');

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    constructor(private alertService: AlertService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return handleRoute(request, next, this.alertService);
    }
}

function handleRoute(request: HttpRequest<any>, next: HttpHandler, alertService: AlertService) {
    const { url, method, body } = request;

    switch (true) {
        case url.endsWith('/accounts/authenticate') && method === 'POST':
            return authenticate(body);
        case url.endsWith('/accounts/refresh-token') && method === 'POST':
            return refreshToken();
        case url.endsWith('/accounts/revoke-token') && method === 'POST':
            return revokeToken();
        case url.endsWith('/accounts/register') && method === 'POST':
            return register(body, alertService);
        case url.endsWith('/accounts/verify-email') && method === 'POST':
            return verifyEmail(body);
        case url.endsWith('/accounts/forgot-password') && method === 'POST':
            return forgotPassword(body, alertService);
        case url.endsWith('/accounts/validate-reset-token') && method === 'POST':
            return validateResetToken(body);
        case url.endsWith('/accounts/reset-password') && method === 'POST':
            return resetPassword(body);
        case url.endsWith('/accounts') && method === 'GET':
            return getAccounts();
        case /\/accounts\/\d+$/.test(url) && method === 'GET':
            return getAccountById(url);
        case url.endsWith('/accounts') && method === 'POST':
            return createAccount(body);
        case /\/accounts\/\d+$/.test(url) && method === 'PUT':
            return updateAccount(url, body);
        case /\/accounts\/\d+$/.test(url) && method === 'DELETE':
            return deleteAccount(url);
        default:
            return next.handle(request);
    }
}

function authenticate(body: any) {
    const { email, password } = body;
    const account = accounts.find(x => x.email === email && x.password === password);

    if (!account) return error('Email or password is incorrect');

    // Generate fake JWT token
    const token = `fake-jwt-token.${account.id}`;
    
    return ok({
        ...basicDetails(account),
        token
    });
}

function refreshToken() {
    return ok({ message: 'Refresh token logic not implemented yet' });
}

function revokeToken() {
    return ok({ message: 'Token revoked successfully' });
}

function register(body: any, alertService: AlertService) {
    const account = body;

    if (accounts.find(x => x.email === account.email)) {
        setTimeout(() => {
            alertService.info(`
                <h4>Email Already Registered</h4>
                <p>Your email "${account.email}" is already registered.</p>
                <p>If you forgot your password, visit <a href="${location.origin}/account/forgot-password">Forgot Password</a>.</p>
            `, { autoClose: false });
        }, 1000);
        return ok();
    }

    account.id = newAccountId();
    account.role = account.id === 1 ? Role.Admin : Role.User;
    account.dateCreated = new Date().toISOString();
    account.verificationToken = new Date().getTime().toString();
    account.isVerified = false;
    account.refreshTokens = [];
    delete account.confirmPassword;
    accounts.push(account);
    localStorage.setItem(accountsKey, JSON.stringify(accounts));

    setTimeout(() => {
        const verifyUrl = `${location.origin}/account/verify-email?token=${account.verificationToken}`;
        alertService.info(`
            <h4>Verification Email</h4>
            <p>Please click the below link to verify your email:</p>
            <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        `, { autoClose: false });
    }, 1000);

    return ok();
}

function verifyEmail(body: any) {
    return ok({ message: 'Email verified successfully' });
}

function forgotPassword(body: any, alertService: AlertService) {
    return ok({ message: 'Password reset instructions sent to email' });
}

function validateResetToken(body: any) {
    return ok({ message: 'Reset token is valid' });
}

function resetPassword(body: any) {
    return ok({ message: 'Password reset successful' });
}

function getAccounts() {
    return ok(accounts.map(x => basicDetails(x)));
}

function getAccountById(url: string) {
    const id = idFromUrl(url);
    const account = accounts.find(x => x.id === id);
    return account ? ok(basicDetails(account)) : error('Account not found');
}

function createAccount(body: any) {
    return ok({ message: 'Account created successfully' });
}

function updateAccount(url: string, body: any) {
    const id = idFromUrl(url);
    const account = accounts.find(x => x.id === id);

    if (!account) return error('Account not found');

    Object.assign(account, body);
    localStorage.setItem(accountsKey, JSON.stringify(accounts));

    return ok({ message: 'Account updated successfully' });
}

function deleteAccount(url: string) {
    const id = idFromUrl(url);
    accounts = accounts.filter(x => x.id !== id);
    localStorage.setItem(accountsKey, JSON.stringify(accounts));

    return ok({ message: 'Account deleted successfully' });
}

// Helper Functions
function ok(body?: any) {
    return of(new HttpResponse({ status: 200, body })).pipe(delay(500), materialize(), dematerialize());
}

function error(message: string) {
    return throwError(() => new HttpResponse({ status: 400, body: { message } }));
}

function basicDetails(account: any) {
    const { id, email, firstName, lastName, role } = account;
    return { id, email, firstName, lastName, role };
}

function idFromUrl(url: string) {
    const urlParts = url.split('/');
    return parseInt(urlParts[urlParts.length - 1]);
}

function newAccountId() {
    return accounts.length ? Math.max(...accounts.map(x => x.id)) + 1 : 1;
}

export let fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};