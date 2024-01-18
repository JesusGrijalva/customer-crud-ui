import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { CustomersComponent } from './customers.component';
import { CustomerService } from '../../services/customer.service';
import { AddEditComponent } from './add-edit/add-edit.component';
import { AddEditModel } from 'src/app/models/add-edit';
import { CustomerModel } from 'src/app/models/customers/customer';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

describe('CustomersComponent', () => {
  let component: CustomersComponent;
  let fixture: ComponentFixture<CustomersComponent>;
  let customerServiceSpy: jasmine.SpyObj<CustomerService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(waitForAsync(() => {
    customerServiceSpy = jasmine.createSpyObj('CustomerService', ['getAll', 'delete']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      declarations: [CustomersComponent],
      providers: [
        { provide: CustomerService, useValue: customerServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCustomers on ngOnInit', () => {
    spyOn(component, 'getCustomers');
    component.ngOnInit();
    expect(component.getCustomers).toHaveBeenCalled();
  });

  it('should call add method on button click', () => {
    spyOn(component, 'add');
    const addButton = fixture.debugElement.query(By.css('.add-button'));
    addButton.triggerEventHandler('click', null);
    expect(component.add).toHaveBeenCalled();
  });

  it('should call getCustomers and openSnackBar on successful add', () => {
    spyOn(component, 'getCustomers');
    spyOn(component, 'openSnackBar');
    
    dialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as unknown as MatDialogRef<AddEditComponent, AddEditModel<CustomerModel>>);
  
    component.add();
  
    expect(component.getCustomers).toHaveBeenCalled();
    expect(component.openSnackBar).toHaveBeenCalledWith('New customer successfully added! Your changes have been saved!');
  });

  it('should call edit method on editEvent emit', () => {
    spyOn(component, 'edit');
    const customer: CustomerModel = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', created: new Date(), updated: new Date() };
    component.edit(customer);
    expect(component.edit).toHaveBeenCalledWith(customer);
  });

  it('should call getCustomers and openSnackBar on successful edit', () => {
    spyOn(component, 'getCustomers');
    spyOn(component, 'openSnackBar');
    dialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as unknown as MatDialogRef<AddEditComponent, AddEditModel<CustomerModel>>);

    const customer: CustomerModel = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', created: new Date(), updated: new Date() };
    component.edit(customer);

    expect(component.getCustomers).toHaveBeenCalled();
    expect(component.openSnackBar).toHaveBeenCalledWith('Customer information successfully updated! Your changes have been saved!');
  });

  it('should call delete method on deleteEvent emit', () => {
    spyOn(component, 'delete');
    const customer: CustomerModel = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', created: new Date(), updated: new Date() };
    component.delete(customer);
    expect(component.delete).toHaveBeenCalledWith(customer);
  });

  it('should call customerService.delete, getCustomers, and openSnackBar on successful delete', () => {
    spyOn(component, 'getCustomers');
    spyOn(component, 'openSnackBar');
    dialogSpy.open.and.returnValue({ afterClosed: () => of(true) } as MatDialogRef<ConfirmationDialogComponent, boolean>);
    customerServiceSpy.delete.and.returnValue(of(null));

    const customer: CustomerModel = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', created: new Date(), updated: new Date() };
    component.delete(customer);

    expect(customerServiceSpy.delete).toHaveBeenCalledWith(customer.id);
    expect(component.getCustomers).toHaveBeenCalled();
    expect(component.openSnackBar).toHaveBeenCalledWith('Customer successfully deleted. The record has been removed!');
  });

});
