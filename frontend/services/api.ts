import type { Product, Customer, Sale, Expense, Table, TableOrder, SaleItem, PaymentMethod, TableStatus, SplitBill } from '../types';

const API_BASE_URL = '/api'; // Backend is served from the same origin

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let errorMessage = `API error: ${response.statusText}`;
        try {
            const errorBody = await response.json();
            errorMessage = errorBody.message || errorMessage;
        } catch (e) {
            // Ignore if response is not JSON
        }
        throw new Error(errorMessage);
    }
    if (response.status === 204) { // Handle "No Content" response
        return undefined as T;
    }
    return response.json() as Promise<T>;
}


const api = {
    async getAllData() {
        return handleResponse<{
            products: Product[],
            customers: Customer[],
            sales: Sale[],
            expenses: Expense[],
            tables: Table[],
            tableOrders: TableOrder[],
        }>(await fetch(`${API_BASE_URL}/data`));
    },

    async addProduct(product: Omit<Product, 'id'>) {
        return handleResponse<Product>(await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        }));
    },

    async updateProduct(updatedProduct: Product) {
        return handleResponse<Product>(await fetch(`${API_BASE_URL}/products/${updatedProduct.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct),
        }));
    },

    async deleteProduct(productId: string) {
        return handleResponse<void>(await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'DELETE',
        }));
    },
  
    async addCustomer(customer: Omit<Customer, 'id' | 'balance'>) {
        return handleResponse<Customer>(await fetch(`${API_BASE_URL}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customer),
        }));
    },
    
    async updateCustomer(updatedCustomer: Customer) {
        return handleResponse<Customer>(await fetch(`${API_BASE_URL}/customers/${updatedCustomer.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCustomer),
        }));
    },

    async deleteCustomer(customerId: string) {
        return handleResponse<void>(await fetch(`${API_BASE_URL}/customers/${customerId}`, {
            method: 'DELETE',
        }));
    },
    
    async addSale(saleData: { items: SaleItem[], total: number, paymentMethod: PaymentMethod, customerId?: string, tableNumber?: number, customerCount?: number }) {
        return handleResponse<{ newSale: Sale, updatedCustomers: Customer[], updatedProducts: Product[] }>(await fetch(`${API_BASE_URL}/sales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saleData)
        }));
    },
  
    async addExpense(expense: Omit<Expense, 'id'>) {
        return handleResponse<Expense>(await fetch(`${API_BASE_URL}/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense),
        }));
    },
  
    async addCustomerPayment(customerId: string, data: { amount: number, paymentMethod: PaymentMethod }) {
        return handleResponse<{ updatedCustomer: Customer, allSales: Sale[] }>(await fetch(`${API_BASE_URL}/customers/${customerId}/payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }));
    },
  
    async updateTableStatus(tableId: string, data: { status: TableStatus }) {
        return handleResponse<Table>(await fetch(`${API_BASE_URL}/tables/${tableId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }));
    },
  
    async addItemsToTable(tableId: string, data: { itemsToAdd: SaleItem[], customerCount?: number }) {
        return handleResponse<{ updatedOrder: TableOrder }>(await fetch(`${API_BASE_URL}/tableOrders/${tableId}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }));
    },

    async updateItemOnTable(tableId: string, productId: string, data: { delta: number }) {
        return handleResponse<TableOrder>(await fetch(`${API_BASE_URL}/tableOrders/${tableId}/items/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }));
    },
    
    async removeItemFromTable(tableId: string, productId: string) {
        const response = await fetch(`${API_BASE_URL}/tableOrders/${tableId}/items/${productId}`, {
            method: 'DELETE',
        });
        return handleResponse<any>(response);
    },

    async finalizeTableSale(tableId: string, data: { paymentMethod: PaymentMethod, customerId?: string }) {
        return handleResponse<{ newSale: Sale, tableOrders: TableOrder[], tables: Table[], products: Product[], customers: Customer[] }>(await fetch(`${API_BASE_URL}/tableOrders/${tableId}/finalize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }));
    },
    
    async splitAction(tableId: string, action: string, payload?: any) {
        return handleResponse<any>(await fetch(`${API_BASE_URL}/tableOrders/${tableId}/split`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, payload }),
        }));
    },

    async isOrderSettled(tableId: string) {
        return handleResponse<{ settled: boolean }>(await fetch(`${API_BASE_URL}/tableOrders/${tableId}/isSettled`));
    },

    async saveTableLayout(newTables: Table[]) {
        return handleResponse<Table[]>(await fetch(`${API_BASE_URL}/tables`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTables),
        }));
    },

    async addTable() {
        return handleResponse<Table>(await fetch(`${API_BASE_URL}/tables`, {
            method: 'POST',
        }));
    },

    async deleteTable(tableId: string) {
        const response = await fetch(`${API_BASE_URL}/tables/${tableId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete table');
        }
    },

    async reopenTable(saleId: string) {
        return handleResponse<any>(await fetch(`${API_BASE_URL}/sales/reopen`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ saleId }),
        }));
    },

    async emitNFCe(saleId: string, data: { cpf?: string }) {
        return handleResponse<Sale>(await fetch(`${API_BASE_URL}/sales/${saleId}/nfce`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }));
    },
};

export default api;