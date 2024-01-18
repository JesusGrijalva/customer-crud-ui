import { Component, OnInit } from '@angular/core';
import { TableDefinition, TableTypes } from 'src/app/models/table-definition';
import { CustomerService } from '../../services/customer.service';
import { SharedOperations } from 'src/app/shared/shared-operations';
import { CustomerModel } from 'src/app/models/customers/customer';
import { MatDialog } from '@angular/material/dialog';
import { AddEditComponent } from './add-edit/add-edit.component';
import { AddEditModel } from 'src/app/models/add-edit';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent extends SharedOperations<CustomerModel> implements OnInit  {

  tableDefinition: TableDefinition[] =[
    {
      column: 'action',
      displayName: 'Action',
      type: TableTypes.action
    },
    {
      column: 'id',
      displayName: 'ID',
      type: TableTypes.text
    },
    {
      column: 'firstName',
      displayName: 'First Name',
      type: TableTypes.text
    },
    {
      column: 'lastName',
      displayName: 'Last Name',
      type: TableTypes.text
    },
    {
      column: 'email',
      displayName: 'Email',
      type: TableTypes.text
    },
    {
      column: 'created',
      displayName: 'Created Date',
      type: TableTypes.dateTime
    },
    {
      column: 'updated',
      displayName: 'Last Updated',
      type: TableTypes.dateTime
    },
  ]

  customerModel: CustomerModel = {} as CustomerModel;

  

  constructor(public customerService: CustomerService, public dialog: MatDialog, public snackBar: MatSnackBar) {
    super(snackBar);
  }

  ngOnInit(): void {

    this.getCustomers();
  }
  
  add(){
    this.customerModel = {} as CustomerModel;

    const data: AddEditModel<CustomerModel> = {
      dialogTitle: 'Add New Customer',
      data: this.customerModel,
      update: false
    }
    const dialogRef = this.dialog.open(AddEditComponent, {
      width: '640px',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getCustomers();
        this.openSnackBar('New customer successfully added! Your changes have been saved!');
      }      
    });
  }

  edit(element: CustomerModel) {
    const data: AddEditModel<CustomerModel> = {
      dialogTitle: 'Edit Customer',
      data: element,
      update: true
    }
    const dialogRef = this.dialog.open(AddEditComponent, {
      width: '640px',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.getCustomers();
        this.openSnackBar('Customer information successfully updated! Your changes have been saved!');
      }
      
    });
  }

  delete(element: CustomerModel) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Delete ${element.firstName} ${element.lastName} Customer!`,
        message: 'Deleting this customer is irreversible. Are you absolutely certain you want to proceed with the deletion?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerService.delete(element.id).subscribe(() => this.getCustomers());
        this.openSnackBar('Customer successfully deleted. The record has been removed!');
      } 
    });
  }
  

  getCustomers(){
    const operation$ = this.customerService.getAll();

    this.bind(operation$);
  }
}
