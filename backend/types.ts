export type Product = {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    imageUrl?: string;
};

export type Customer = {
    id: string;
    name: string;
    email: string;
    phone: string;
    balance: number;
};

export type SaleItem = {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
};

export type PaymentMethod = 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Pix' | 'Fiado';

export type Sale = {
    id: string;
    items: SaleItem[];
    total: number;
    paymentMethod: PaymentMethod;
    customerId?: string;
    tableNumber?: number;
    customerCount?: number;
    createdAt: string;
    nfceEmitted: boolean;
    cpf?: string;
};

export type Expense = {
    id: string;
    description: string;
    amount: number;
    date: string;
    category: string;
};

export type TableStatus = 'Livre' | 'Ocupada' | 'Reservada';

export type Table = {
    id: string;
    number: number;
    status: TableStatus;
};

export type TableOrder = {
    id: string;
    tableId: string;
    items: SaleItem[];
    total: number;
    createdAt: string;
    customerCount?: number;
    splitBills?: SplitBill[];
};

export type SplitBill = {
    id: string;
    items: SaleItem[];
    total: number;
    paid: boolean;
    paymentMethod?: PaymentMethod;
};
