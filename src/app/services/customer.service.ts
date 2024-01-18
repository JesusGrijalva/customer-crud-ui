import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, reduce } from "rxjs";
import { environment } from "src/environments/environment";
import { CustomerModel } from "../models/customers/customer";

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    constructor(private http: HttpClient) {}

    getAll(): Observable<any> {
        return this.http.get(`${environment.urls.apiEndpoint}api/customer`);
    }

    create(record: CustomerModel): Observable<any>{
        return this.http.post(`${environment.urls.apiEndpoint}api/customer`, record);
    }

    update(record: CustomerModel): Observable<any>{
        return this.http.put(`${environment.urls.apiEndpoint}api/customer`, record);
    }

    delete(recordId: number): Observable<any>{
        return this.http.delete(`${environment.urls.apiEndpoint}api/customer/${recordId}`);
    }
}