export type PaymentMethod = 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito';

export interface SaleItem {
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  paymentMethod: PaymentMethod;
  discount: number;
  customerName: string;
  sellerId: string;
  sellerName: string;
  createdAt: string;
}

export interface SaleForm {
  items: Omit<SaleItem, 'subtotal'>[];
  paymentMethod: PaymentMethod;
  discount: number;
  customerName: string;
}

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  dinheiro:       'Dinheiro',
  pix:            'PIX',
  cartao_credito: 'Cartão de Crédito',
  cartao_debito:  'Cartão de Débito',
};

export interface DashboardStats {
  totalSalesToday: number;
  totalRevenueToday: number;
  totalRevenueMonth: number;
  totalSalesMonth: number;
  topProducts: { name: string; quantity: number }[];
  recentSales: Sale[];
  revenueByDay: { date: string; revenue: number }[];
}
