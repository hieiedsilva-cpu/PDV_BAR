import { Product, Customer, Sale, Expense, Table } from "./types";

export const initialProducts: Product[] = [
    { id: "1", name: "Cerveja Skol", price: 8.00, stock: 100, category: "Bebidas" },
    { id: "2", name: "Porção de Batata Frita", price: 25.00, stock: 50, category: "Porções" },
    { id: "3", name: "Refrigerante Coca-Cola", price: 6.00, stock: 120, category: "Bebidas" },
    { id: "4", name: "Água Mineral", price: 4.00, stock: 200, category: "Bebidas" },
    { id: "5", name: "Caipirinha", price: 18.00, stock: 70, category: "Bebidas" },
    { id: "6", name: "Picanha na Chapa", price: 80.00, stock: 30, category: "Pratos" },
    { id: "7", name: "Pastel de Carne", price: 7.00, stock: 90, category: "Salgados" },
    { id: "8", name: "Suco de Laranja", price: 10.00, stock: 60, category: "Bebidas" },
    { id: "9", name: "Brigadeiro", price: 5.00, stock: 100, category: "Sobremesas" },
    { id: "10", name: "Hamburguer Artesanal", price: 30.00, stock: 40, category: "Lanches" },
];

export const initialCustomers: Customer[] = [
    { id: "c1", name: "João Silva", email: "joao@example.com", phone: "11987654321", balance: 0 },
    { id: "c2", name: "Maria Souza", email: "maria@example.com", phone: "11998765432", balance: 0 },
    { id: "c3", name: "Pedro Santos", email: "pedro@example.com", phone: "11976543210", balance: 0 },
];

export const initialSales: Sale[] = [
    {
        id: "s1",
        items: [
            { productId: "1", name: "Cerveja Skol", quantity: 2, unitPrice: 8.00 },
            { productId: "3", name: "Refrigerante Coca-Cola", quantity: 1, unitPrice: 6.00 },
        ],
        total: 22.00,
        paymentMethod: "Dinheiro",
        createdAt: new Date("2024-08-20T10:00:00Z").toISOString(),
        nfceEmitted: true,
    },
    {
        id: "s2",
        items: [
            { productId: "2", name: "Porção de Batata Frita", quantity: 1, unitPrice: 25.00 },
            { productId: "5", name: "Caipirinha", quantity: 2, unitPrice: 18.00 },
        ],
        total: 61.00,
        paymentMethod: "Cartão de Crédito",
        customerId: "c1",
        createdAt: new Date("2024-08-20T14:30:00Z").toISOString(),
        nfceEmitted: false,
    },
];

export const initialExpenses: Expense[] = [
    {
        id: "e1",
        description: "Compra de insumos",
        amount: 150.00,
        date: new Date("2024-08-19T09:00:00Z").toISOString(),
        category: "Estoque",
    },
    {
        id: "e2",
        description: "Pagamento de aluguel",
        amount: 2000.00,
        date: new Date("2024-08-01T08:00:00Z").toISOString(),
        category: "Despesas Fixas",
    },
];

export const initialTables: Table[] = [
    { id: "t1", number: 1, status: "Livre" },
    { id: "t2", number: 2, status: "Ocupada" },
    { id: "t3", number: 3, status: "Livre" },
];
