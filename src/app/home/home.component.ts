import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountService } from '../_services';
import { Account } from '../_models';

@Component({
    templateUrl: 'home.component.html',
    standalone: true,
    imports: [CommonModule]
})
export class HomeComponent {
    account: Account | null = null;

    constructor(private accountService: AccountService) {
        this.accountService.account.subscribe(x => this.account = x);
    }
}