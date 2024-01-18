import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddEditModel } from 'src/app/models/add-edit';
import { CustomerModel } from 'src/app/models/customers/customer';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from '../../../services/customer.service';
import { EMPTY, Observable, catchError, take, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {

  customerForm: FormGroup = new FormGroup({
    firstName: new FormControl(['', Validators.required]),
    lastName: new FormControl(['', Validators.required]),
    email: new FormControl(['', [Validators.required, Validators.email]])
  });

  dialogTitle: string = '';
  customerData: CustomerModel = {} as CustomerModel;
  isUpdate: boolean = false;

  constructor(
    private fb: FormBuilder,
    public customerService: CustomerService,
    public dialogRef: MatDialogRef<AddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddEditModel<CustomerModel>,
    public _snackBar: MatSnackBar
    ) {
  }

  ngOnInit(): void {
    this.dialogTitle = this.data.dialogTitle;
    this.customerData = this.data.data;
    this.isUpdate = this.data.update;

    this.customerForm = this.fb.group({
      firstName: [this.customerData.firstName, Validators.required],
      lastName: [this.customerData.lastName, Validators.required],
      email: [this.customerData.email, [Validators.required, Validators.email]]
    });
  }

  submitForm() {
    if (this.customerForm.valid) {

      this.customerData.firstName = this.customerForm?.get('firstName')?.value;
      this.customerData.lastName = this.customerForm?.get('lastName')?.value;
      this.customerData.email = this.customerForm?.get('email')?.value;

      const operation$ = this.isUpdate ? this.customerService.update(this.customerData) : this.customerService.create(this.customerData);

      this.insertOrUpdateItem(operation$);
    }
  }

  private insertOrUpdateItem(operation$: Observable<any>) {
    operation$
      .pipe(
        take(1),
        tap(() => { 
            this.dialogRef.close('updated');
        }),
        catchError((err: HttpErrorResponse) => {
          this.handleOperationError(err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  private handleOperationError(err: HttpErrorResponse) {
    const error: string = err?.error || err.error?.message || err.message;
    this._snackBar.open(`An error ocurred: ${error}`, 'Dismiss');
  }
}
