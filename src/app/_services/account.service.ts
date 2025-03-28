import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

// import { environment } from '@environments/environment';
import { environment } from '../environments/environment';
import { Account } from '../_models';

const baseUrl = `${environment.apiUrl}/accounts`;

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account | null>;
    public account: Observable<Account | null>;
    private refreshTokenTimeout!: ReturnType<typeof setTimeout>;

    constructor(private router: Router, private http: HttpClient) {
        this.accountSubject = new BehaviorSubject<Account | null>(null);
        this.account = this.accountSubject.asObservable();
    }

    public get accountValue(): Account | null {
        return this.accountSubject.value;
    }

    // Authentication Methods
    login(email: string, password: string): Observable<Account> {
        return this.http.post<Account>(`${baseUrl}/authenticate`, { email, password }, { withCredentials: true })
            .pipe(
                map(account => {
                    this.accountSubject.next(account);
                    this.startRefreshTokenTimer();
                    return account;
                })
            );
    }

    logout(): void {
        this.http.post<any>(`${baseUrl}/revoke-token`, {}, { withCredentials: true }).subscribe();
        this.stopRefreshTokenTimer();
        this.accountSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    refreshToken(): Observable<Account> {
        return this.http.post<Account>(`${baseUrl}/refresh-token`, {}, { withCredentials: true })
            .pipe(
                map(account => {
                    this.accountSubject.next(account);
                    this.startRefreshTokenTimer();
                    return account;
                })
            );
    }

    // Account Management
    register(account: Account): Observable<Account> {
        return this.http.post<Account>(`${baseUrl}/register`, account);
    }

    verifyEmail(token: string): Observable<Account> {
        return this.http.post<Account>(`${baseUrl}/verify-email`, { token });
    }

    forgotPassword(email: string): Observable<void> {
        return this.http.post<void>(`${baseUrl}/forgot-password`, { email });
    }

    validateResetToken(token: string): Observable<Account> {
        return this.http.post<Account>(`${baseUrl}/validate-reset-token`, { token });
    }

    resetPassword(token: string, password: string, confirmPassword: string): Observable<Account> {
        return this.http.post<Account>(`${baseUrl}/reset-password`, { token, password, confirmPassword });
    }

    // CRUD Operations
    getAll(): Observable<Account[]> {
        return this.http.get<Account[]>(baseUrl);
    }

    getById(id: string): Observable<Account> {
        return this.http.get<Account>(`${baseUrl}/${id}`);
    }

    create(params: Partial<Account>): Observable<Account> {
        return this.http.post<Account>(baseUrl, params);
    }

    update(id: string, params: Partial<Account>): Observable<Account> {
        return this.http.put<Account>(`${baseUrl}/${id}`, params)
            .pipe(
                map((account: Account) => {
                    // Update the current account if it was updated
                    if (account.id === this.accountValue?.id) {
                        account = { ...this.accountValue, ...account };
                        this.accountSubject.next(account);
                    }
                    return account;
                })
            );
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${baseUrl}/${id}`)
            .pipe(
                finalize(() => {
                    // Auto logout if the logged-in account was deleted
                    if (id === this.accountValue?.id) {
                        this.logout();
                    }
                })
            );
    }

    // Helper Methods
    private startRefreshTokenTimer(): void {
        const account = this.accountValue;
        if (!account?.jwtToken) return;

        const jwtToken = JSON.parse(atob(account.jwtToken.split('.')[1]));
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer(): void {
        clearTimeout(this.refreshTokenTimeout);
    }
}
