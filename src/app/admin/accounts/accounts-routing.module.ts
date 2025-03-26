import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';

const route: Routes = [
    { path : '', component : ListComponent},
    { path : 'add',component : AddEditComponent},
    { path : 'edit/:id',component : AddEditComponent},

];

@NgModule ({
    import: [RouterModule.forChild(Routes)],
    export: [RouterModule]
})
export class AccountRoutingModule {}