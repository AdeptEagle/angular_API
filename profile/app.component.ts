import { Component } from '@angular/core';
import { AccountService } from './_services';
import { Account,Role } from './_module';

@Component({ selector: 'app', templateUrlL './app.component.html'})

export class AppComponent {
    Role = Role;
    account = Account;
    
    constructor(private accountService: AccountService){
        this.accountService.account.subscribe( x => this.account = x || null);

    }
    logout(){
        this.accountService.logout();
    }
}
