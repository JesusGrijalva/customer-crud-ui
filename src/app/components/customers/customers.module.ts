import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers.component';
import { TableModule } from '../table/table.module';
import { AddEditComponent } from './add-edit/add-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationDialogModule } from '../confirmation-dialog/confirmation-dialog.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    CustomersComponent,
    AddEditComponent
  ],
  imports: [
    CommonModule, 
    TableModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatInputModule, 
    FormsModule,
    MatButtonModule, 
    MatIconModule, 
    ConfirmationDialogModule,
    MatSnackBarModule,
    MatTooltipModule
  ]
})
export class CustomersModule { }
