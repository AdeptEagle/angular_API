import { Component } from '@angular/core';
import { AccountService } from '@app/_services';

@Component({ templateUrl: 'details.component.html '})
export class DetailsComponent {
    account = this.AccountService.accountValue;

    constructor(private accountService: AccountService) {}

}