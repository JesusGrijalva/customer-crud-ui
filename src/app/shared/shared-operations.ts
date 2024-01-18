import { HttpErrorResponse } from "@angular/common/http";
import { Injectable, ViewChild, Component } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { EMPTY, Observable, catchError, take, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
export class SharedOperations<T>{

    isLoading: boolean = false;
    data: T[] = [];
    componentName: string = '';
    dataSource = new MatTableDataSource<T>();

    private durationInSeconds = 5;

    constructor(public _snackBar: MatSnackBar){}
    
    bind(operation$: Observable<any>) {
        this.isLoading = true;

        operation$.pipe(take(1)).subscribe({
            next: (value) => {
                if (!!value) {
                    this.data = value;
                    this.dataSource = new MatTableDataSource(this.data);
                }
            },
            complete: () => {
                this.isLoading = false;
            },
            error: (err: HttpErrorResponse) => {
                const error = err.error?.Message || err.message;
                this.isLoading = false;
                console.error(`Error occurred while fetching ${this.componentName}:`, error);
            }
        });
    }  

    openSnackBar(message: string) {
        this._snackBar.open(message, 'Dismiss', {duration: this.durationInSeconds * 1000});
      }    
    
}
