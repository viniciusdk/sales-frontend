import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product, ProductForm } from '../../../shared/models/product.model';

let MOCK_PRODUCTS: Product[] = [
  { id: '1', code: 'FEM001', name: 'Blusa Floral Rosa',       description: 'Blusa feminina com estampa floral',       price: 59.90,  stock: 15, category: 'feminino',   createdAt: '2026-04-01', updatedAt: '2026-04-01' },
  { id: '2', code: 'FEM002', name: 'Vestido Midi Lilás',      description: 'Vestido midi elegante na cor lilás',       price: 129.90, stock: 8,  category: 'feminino',   createdAt: '2026-04-02', updatedAt: '2026-04-02' },
  { id: '3', code: 'MAS001', name: 'Camisa Social Azul',      description: 'Camisa social masculina azul claro',      price: 89.90,  stock: 20, category: 'masculino',  createdAt: '2026-04-03', updatedAt: '2026-04-03' },
  { id: '4', code: 'INF001', name: 'Conjunto Infantil Verão', description: 'Conjunto camiseta e short infantil',       price: 49.90,  stock: 12, category: 'infantil',   createdAt: '2026-04-05', updatedAt: '2026-04-05' },
  { id: '5', code: 'ACE001', name: 'Bolsa Tiracolo Roxa',     description: 'Bolsa pequena tiracolo na cor roxa',       price: 79.90,  stock: 6,  category: 'acessorios', createdAt: '2026-04-10', updatedAt: '2026-04-10' },
  { id: '6', code: 'FEM003', name: 'Calça Palazzo Branca',    description: 'Calça palazzo fluida branca',             price: 99.90,  stock: 10, category: 'feminino',   createdAt: '2026-04-12', updatedAt: '2026-04-12' },
];

@Injectable({ providedIn: 'root' })
export class ProductsService {
  getAll(): Observable<Product[]> {
    return of([...MOCK_PRODUCTS]).pipe(delay(400));
  }

  getById(id: string): Observable<Product | undefined> {
    return of(MOCK_PRODUCTS.find(p => p.id === id)).pipe(delay(300));
  }

  create(form: ProductForm): Observable<Product> {
    const product: Product = {
      ...form,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_PRODUCTS = [product, ...MOCK_PRODUCTS];
    return of(product).pipe(delay(500));
  }

  update(id: string, form: ProductForm): Observable<Product> {
    const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
    const updated: Product = { ...MOCK_PRODUCTS[idx], ...form, updatedAt: new Date().toISOString() };
    MOCK_PRODUCTS[idx] = updated;
    return of(updated).pipe(delay(500));
  }

  delete(id: string): Observable<void> {
    MOCK_PRODUCTS = MOCK_PRODUCTS.filter(p => p.id !== id);
    return of(undefined).pipe(delay(400));
  }
}
