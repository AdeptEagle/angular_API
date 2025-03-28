import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// import { AccountService } from '@app/_services';
import { AccountService } from '../_services';

@Component({
    templateUrl: 'layout.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class LayoutComponent {
    constructor (
        private router: Router,
        private accountService: AccountService
    ) {
        if (this.accountService.accountValue) {
            this.router.navigate(['/']);
        }
    }
}