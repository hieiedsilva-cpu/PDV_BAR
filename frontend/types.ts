
export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  category: string;
  ncm: string;
  cest?: string;
  cfop: string;
  origem: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  balance: number;
}

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export type PaymentMethod = 'Dinheiro' | 'Cartão' | 'PIX' | 'Fiado';

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  paymentMethod: PaymentMethod;
  customerId?: string;
  tableNumber?: number;
  customerCount?: number;
  createdAt: string; // ISO string
  cpf?: string;
  nfceEmitted: boolean;
}

export interface Expense {
  id:string;
  description: string;
  amount: number;
  date: string; // ISO string
  category: string;
}

export type TableStatus = 'Livre' | 'Ocupada' | 'Atenção' | 'Conta Pedida';

export interface Table {
  id: string;
  number: number;
  status: TableStatus;
}

export interface SplitBill {
  id: string;
  items: SaleItem[];
  total: number;
  paid: boolean;
  paymentMethod?: PaymentMethod;
}

export interface TableOrder {
  id: string;
  tableId: string;
  items: SaleItem[];
  total: number;
  createdAt: string;
  customerCount?: number;
  splitBills?: SplitBill[];
}