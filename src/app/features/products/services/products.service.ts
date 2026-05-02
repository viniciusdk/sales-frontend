import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductForm } from '../../../shared/models/product.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/products`;

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.base);
  }

  create(form: ProductForm): Observable<Product> {
    console.log('Creating product with form:', form);
    return this.http.post<Product>(this.base, form);
  }

  update(id: string, form: ProductForm): Observable<Product> {
    return this.http.put<Product>(`${this.base}/${id}`, form);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  importProducts(products: ProductForm[]): Observable<{ success: number; errors: { row: number; message: string }[] }> {
    return this.http.post<{ success: number; errors: { row: number; message: string }[] }>(`${this.base}/import/json`, products);
  }
}
