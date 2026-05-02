export type ProductCategory = 'feminino' | 'masculino' | 'infantil' | 'acessorios' | 'diversos';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  category: ProductCategory;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductForm {
  name: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  category: ProductCategory;
  code: string;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  feminino:   'Feminino',
  masculino:  'Masculino',
  infantil:   'Infantil',
  acessorios: 'Acessórios',
  diversos:    'Diversos',
};
