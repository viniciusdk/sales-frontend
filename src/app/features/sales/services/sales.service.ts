import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Sale, SaleForm } from '../../../shared/models/sale.model';
import { AuthService } from '../../../core/services/auth.service';

let MOCK_SALES: Sale[] = [
  {
    id: '1',
    items: [
      { productId: '1', productName: 'Blusa Floral Rosa', productCode: 'FEM001', quantity: 2, unitPrice: 59.90, subtotal: 119.80 },
      { productId: '5', productName: 'Bolsa Tiracolo Roxa', productCode: 'ACE001', quantity: 1, unitPrice: 79.90, subtotal: 79.90 },
    ],
    total: 199.70, paymentMethod: 'pix', discount: 0,
    customerName: 'Maria Silva', sellerId: '1', sellerName: 'Administrador',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    items: [
      { productId: '2', productName: 'Vestido Midi Lilás', productCode: 'FEM002', quantity: 1, unitPrice: 129.90, subtotal: 129.90 },
    ],
    total: 129.90, paymentMethod: 'cartao_credito', discount: 0,
    customerName: 'Ana Souza', sellerId: '1', sellerName: 'Administrador',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    items: [
      { productId: '3', productName: 'Camisa Social Azul', productCode: 'MAS001', quantity: 2, unitPrice: 89.90, subtotal: 179.80 },
      { productId: '4', productName: 'Conjunto Infantil Verão', productCode: 'INF001', quantity: 1, unitPrice: 49.90, subtotal: 49.90 },
    ],
    total: 219.70, paymentMethod: 'dinheiro', discount: 10,
    customerName: 'João Ferreira', sellerId: '1', sellerName: 'Administrador',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

@Injectable({ providedIn: 'root' })
export class SalesService {
  private auth = inject(AuthService);

  getAll(): Observable<Sale[]> {
    return of([...MOCK_SALES].sort((a, b) => b.createdAt.localeCompare(a.createdAt))).pipe(delay(400));
  }

  getById(id: string): Observable<Sale | undefined> {
    return of(MOCK_SALES.find(s => s.id === id)).pipe(delay(300));
  }

  create(form: SaleForm): Observable<Sale> {
    const user = this.auth.currentUser();
    const items = form.items.map(i => ({ ...i, subtotal: i.quantity * i.unitPrice }));
    const subtotalSum = items.reduce((a, i) => a + i.subtotal, 0);
    const sale: Sale = {
      id: crypto.randomUUID(),
      items,
      total: Math.max(0, subtotalSum - form.discount),
      paymentMethod: form.paymentMethod,
      discount: form.discount,
      customerName: form.customerName,
      sellerId: user?.id ?? '1',
      sellerName: user?.name ?? 'Vendedor',
      createdAt: new Date().toISOString(),
    };
    MOCK_SALES = [sale, ...MOCK_SALES];
    return of(sale).pipe(delay(600));
  }
}
