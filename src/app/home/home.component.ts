import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AccountService } from '../_services';

@Component({
    templateUrl: 'home.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class HomeComponent {
    account = this.accountService.accountValue;

    constructor(private accountService: AccountService) {}
}