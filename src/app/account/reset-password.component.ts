import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

// import { AccountService, AlertService } from '@app/_service';
import { AccountService, AlertService } from '../_services';
// import { MustMatch } from '@app/_helpers';
import { mustMatch } from '../_helpers';

enum TokenStatus {
    Validating,
    Valid,
    Invalid
}

@Component({
    templateUrl: 'reset-password.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class ResetPasswordComponent implements OnInit {
    TokenStatus = TokenStatus;
    tokenStatus = TokenStatus.Validating;
    token: string | null = null;
    form!: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.form = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, {
            validator: mustMatch('password', 'confirmPassword')
        });

        const token = this.route.snapshot.queryParams['token'];
        this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

        this.accountService.validateResetToken(token) 
            .pipe(first())
            .subscribe({
                next: () => {
                    this.token = token;
                    this.tokenStatus = TokenStatus.Valid;
                },
                error: () => {
                    this.tokenStatus = TokenStatus.Invalid;
                }
            });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.alertService.clear();

        this.accountService.resetPassword(this.token!, this.f['password'].value, this.f['confirmPassword'].value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Password reset successful, you can now login', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}