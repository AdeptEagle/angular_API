import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { AccountService, AlertService } from '../_services';
import { mustMatch } from '../_helpers';

@Component({ 
    templateUrl: 'profile.component.html',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class ProfileComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.minLength(6), Validators.nullValidator]],
            confirmPassword: ['']
        }, {
            validator: mustMatch('password', 'confirmPassword')
        });

        const account = this.accountService.accountValue;
        if (account) {
            this.form.patchValue(account);
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.update(this.accountService.accountValue!.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
} 