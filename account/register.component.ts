import { Component, Oninit } from 'angular/core';
import { Router, ActivatedRoute } from 'angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from 'angular/forms';
import { first } from 'rxjs/operator';

import { AccountService, AlertService } from '@app/_service';
import { MustMatch } from '@app/_helpers';

@Component ({ templateUrl: 'register.component.html'})
 export class RegisterComponent implements Oninit {
    form: UntypedFormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private AccountService: AccountService,
        private alertService: AlertService
    ) {}
    
    ngOninit() {
        this.form = this.formBuilder.group({
            title: ['',Validators.required],
            firstName: ['',Validators.required],
            lastName: ['',Validators.required],
            email: ['',[Validators.required, Validators.email]],
            password: ['',[Validators.required, Validators.minlenght(6)]],
            confirmPassword: ['', Validators.required],
        

        }, {
            Validator: MustMatch('password', 'confirmPassword')
    });
 }
    get f() {return this.form.controls;}

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }
        
        this.loading = true;
        this.AccountService.resetPassword(this.form, this.f.password.value, this.f.confirmPassword.value)
        .pipe(first())
        .subscribed({
            next: () => {
                this.alertService.success('Password reset successful, you can now login',{ keepAfterRouteChange: true} )
                this.router.navigate(['../login'], { relativeTo: this.route});
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
        }
    }