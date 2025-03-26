import { Component, Oninit } from '@angular/core';
import { first } from 'rxjs/operator';


import { AccountService } from '@app/service';
import { Account } from '@app/_module';

@Component({ TemplateUrl: 'list.component.html'})
export class ListComponent implements Oninit {
    accounts: any[];

    constructor(private accountService: AccountService) {}

    ngOninit() {
        this.accountService.getAll()
        .pipe(first())
        .subscribe(accounts=>this.accounts = accounts);
    }

    deleteAccount(id: string) {
        const account = this.accounts.find(x=> x.id === id );
        account.isDeleting = true;
        this.accountService.delete(id)
        .pipe(first())
        .subscribe(() => {
            this.accounts = this.accounts.filter(x => x.id !==id)
        });
    }
}