import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { AddEditComponent } from './add-edit.component';
import { CustomerService } from '../../../services/customer.service';

describe('AddEditComponent', () => {
  let component: AddEditComponent;
  let fixture: ComponentFixture<AddEditComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AddEditComponent>>;
  let customerServiceSpy: jasmine.SpyObj<CustomerService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const mockDialogData = {
    dialogTitle: 'Test Dialog',
    data: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
    update: false
  };

  beforeEach(waitForAsync(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    customerServiceSpy = jasmine.createSpyObj('CustomerService', ['create', 'update']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      declarations: [AddEditComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: CustomerService, useValue: customerServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with provided data', () => {
    expect(component.customerForm.value).toEqual(mockDialogData.data);
  });

  it('should display error messages for required fields', () => {
    const form = component.customerForm;
    form.get('firstName')?.setValue('');
    form.get('lastName')?.setValue('');
    form.get('email')?.setValue('');

    expect(form.valid).toBeFalsy();
    expect(form.get('firstName')?.hasError('required')).toBeTruthy();
    expect(form.get('lastName')?.hasError('required')).toBeTruthy();
    expect(form.get('email')?.hasError('required')).toBeTruthy();
  });

  it('should display error message for invalid email', () => {
    const form = component.customerForm;
    form.get('email')?.setValue('invalid-email');

    expect(form.valid).toBeFalsy();
    expect(form.get('email')?.hasError('email')).toBeTruthy();
  });

  it('should call create method on form submission for new customer', () => {
    const form = component.customerForm;
    form.setValue({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' });

    customerServiceSpy.create.and.returnValue(of({}));

    component.submitForm();

    expect(customerServiceSpy.create).toHaveBeenCalledWith(component.customerData);
    expect(dialogRefSpy.close).toHaveBeenCalledWith('updated');
  });

  it('should call update method on form submission for existing customer', () => {
    component.isUpdate = true;
    const form = component.customerForm;
    form.setValue({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' });

    customerServiceSpy.update.and.returnValue(of({}));

    component.submitForm();

    expect(customerServiceSpy.update).toHaveBeenCalledWith(component.customerData);
    expect(dialogRefSpy.close).toHaveBeenCalledWith('updated');
  });

});
