import { Routes } from '@angular/router';
import { ListComponent } from './accounts/list.component';
import { AddEditComponent } from './accounts/add-edit.component';

export const routes: Routes = [
    { path: '', component: ListComponent },
    { path: 'add', component: AddEditComponent },
    { path: 'edit/:id', component: AddEditComponent }
]; 