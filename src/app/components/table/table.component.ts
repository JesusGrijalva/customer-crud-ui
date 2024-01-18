import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableDefinition } from 'src/app/models/table-definition';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit {

  @Input() dataSource = new MatTableDataSource<any>();
  @Input() tableDefinition: TableDefinition[] = [];
  @Input() isLoading: boolean = false;
  @Output() editEvent = new EventEmitter<any>();
  @Output() deleteEvent = new EventEmitter<any>();

  displayedColumns: string[] =[];
  selectedRow: any;

  
  @ViewChild('input', { static: false }) inputElement: ElementRef | undefined;

  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    if (this.dataSource) {
      this.dataSource.sort = value;
    }
  }
  
  constructor() { }

  ngOnInit(): void {
    this.displayedColumns = this.tableDefinition.map((item) => item.column);
  }

  edit(element:any) {
    this.editEvent.emit(element);
  }

  delete(element:any) {
    this.deleteEvent.emit(element);
  }

  onRowHover(row: any) {
    this.selectedRow = row;
  }

  onRowLeave(row: any) {
    if (this.selectedRow !== row) {
      this.selectedRow = undefined;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
