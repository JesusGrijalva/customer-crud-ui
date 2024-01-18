import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TableComponent } from './table.component';
import { TableDefinition } from 'src/app/models/table-definition';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  const mockData = [
    { id: 1, name: 'John Doe', date: new Date() },
    // Add more sample data as needed
  ];

  const mockTableDefinition: TableDefinition[] = [
    { column: 'id', displayName: 'ID', type: 1 },
    { column: 'name', displayName: 'Name', type: 1 },
    { column: 'date', displayName: 'Date', type: 2 },
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TableComponent],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatDividerModule,
        MatSidenavModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.dataSource = new MatTableDataSource(mockData);
    component.tableDefinition = mockTableDefinition;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit editEvent when edit button is clicked', () => {
    const spy = spyOn(component.editEvent, 'emit');
    const editButton = fixture.debugElement.nativeElement.querySelector('button[matTooltip="Edit"]');

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      editButton.click();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should apply filter when input value changes', () => {
    const inputElement = fixture.debugElement.nativeElement.querySelector('input');
    const filterValue = 'John Doe';

    inputElement.value = filterValue;
    inputElement.dispatchEvent(new Event('keyup'));

    fixture.detectChanges();

    expect(component.dataSource.filter).toBe(filterValue.trim().toLowerCase());
  });
});
