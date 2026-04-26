export type ProductCategory = 'feminino' | 'masculino' | 'infantil' | 'acessorios';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
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
  stock: number;
  category: ProductCategory;
  code: string;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  feminino:   'Feminino',
  masculino:  'Masculino',
  infantil:   'Infantil',
  acessorios: 'Acessórios',
};
