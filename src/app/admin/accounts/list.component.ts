import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AccountService } from '../../_services';
import { Account } from '../../_models';

@Component({ 
    templateUrl: 'list.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class ListComponent implements OnInit {
    accounts: Account[] = [];

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe({
                next: (accounts) => {
                    this.accounts = accounts;
                },
                error: (error) => {
                    console.error('Error loading accounts:', error);
                }
            });
    }

    deleteAccount(id: string) {
        const account = this.accounts.find(x => x.id === id);
        if (!account) return;
        
        account.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.accounts = this.accounts.filter(x => x.id !== id);
                },
                error: (error) => {
                    console.error('Error deleting account:', error);
                    account.isDeleting = false;
                }
            });
    }
}