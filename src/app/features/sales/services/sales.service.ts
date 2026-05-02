import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale, SaleForm } from '../../../shared/models/sale.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SalesService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/sales`;

  getAll(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.base);
  }

  create(form: SaleForm): Observable<Sale> {
    return this.http.post<Sale>(this.base, form);
  }
}
