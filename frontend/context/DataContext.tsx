import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import type { Product, Customer, Sale, Expense, SaleItem, PaymentMethod, Table, TableOrder, TableStatus, SplitBill } from '../types';
import api from '../services/api';

interface DataContextType {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  expenses: Expense[];
  tables: Table[];
  tableOrders: TableOrder[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'balance'>) => Promise<void>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (customerId: string) => Promise<void>;
  addSale: (items: SaleItem[], total: number, paymentMethod: PaymentMethod, customerId?: string, tableNumber?: number, customerCount?: number) => Promise<Sale>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  addCustomerPayment: (customerId: string, amount: number, paymentMethod: PaymentMethod) => Promise<void>;
  updateTableStatus: (tableId: string, status: TableStatus) => Promise<void>;
  addItemToTable: (tableId: string, product: Product) => Promise<void>;
  addItemsToTable: (tableId: string, itemsToAdd: SaleItem[], customerCount?: number) => Promise<void>;
  updateItemOnTable: (tableId: string, productId: string, delta: number) => Promise<void>;
  removeItemFromTable: (tableId: string, productId: string) => Promise<void>;
  finalizeTableSale: (tableId: string, paymentMethod: PaymentMethod, customerId?: string) => Promise<Sale | null>;
  startSplitting: (tableId: string) => Promise<void>;
  cancelSplitting: (tableId: string) => Promise<void>;
  addSplitAccount: (tableId: string) => Promise<void>;
  moveItemToSplitAccount: (tableId: string, accountId: string, item: SaleItem) => Promise<void>;
  moveItemFromSplitAccount: (tableId: string, accountId: string, item: SaleItem) => Promise<void>;
  paySplitAccount: (tableId: string, accountId: string, paymentMethod: PaymentMethod) => Promise<Sale | null>;
  saveTableLayout: (newTables: Table[]) => Promise<void>;
  addTable: () => Promise<void>;
  deleteTable: (tableId: string) => Promise<void>;
  reopenTable: (saleId: string) => Promise<boolean>;
  emitNFCe: (saleId: string, cpf?: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [tableOrders, setTableOrders] = useState<TableOrder[]>([]);

  useEffect(() => {
    const loadData = async () => {
        try {
            const data = await api.getAllData();
            setProducts(data.products || []);
            setCustomers(data.customers || []);
            setSales(data.sales || []);
            setExpenses(data.expenses || []);
            setTables(data.tables || []);
            setTableOrders(data.tableOrders || []);
        } catch (error) {
            console.error("Failed to load initial data:", error);
        }
    };
    loadData();
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const newProduct = await api.addProduct(product);
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = async (updatedProduct: Product) => {
    const product = await api.updateProduct(updatedProduct);
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = async (productId: string) => {
    await api.deleteProduct(productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
  };
  
  const addCustomer = async (customer: Omit<Customer, 'id' | 'balance'>) => {
    const newCustomer = await api.addCustomer(customer);
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = async (updatedCustomer: Customer) => {
    const customer = await api.updateCustomer(updatedCustomer);
    setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
  };

  const deleteCustomer = async (customerId: string) => {
    await api.deleteCustomer(customerId);
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };
  
  const addSale = async (items: SaleItem[], total: number, paymentMethod: PaymentMethod, customerId?: string, tableNumber?: number, customerCount?: number): Promise<Sale> => {
    const result = await api.addSale({ items, total, paymentMethod, customerId, tableNumber, customerCount });
    setSales(prev => [...prev, result.newSale]);
    if (result.updatedCustomers) setCustomers(result.updatedCustomers);
    if (result.updatedProducts) setProducts(result.updatedProducts);
    return result.newSale;
  };
  
  const finalizeTableSale = async (tableId: string, paymentMethod: PaymentMethod, customerId?: string): Promise<Sale | null> => {
    try {
        const response = await api.finalizeTableSale(tableId, { paymentMethod, customerId });
        if (!response) return null;
        setSales(prev => [...prev, response.newSale]);
        setTableOrders(response.tableOrders);
        setTables(response.tables);
        setProducts(response.products);
        if (response.customers) setCustomers(response.customers);
        return response.newSale;
    } catch (error) {
        console.error("Failed to finalize table sale:", error);
        return null;
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const newExpense = await api.addExpense(expense);
    setExpenses(prev => [...prev, newExpense]);
  };
  
  const addCustomerPayment = async (customerId: string, amount: number, paymentMethod: PaymentMethod) => {
    const result = await api.addCustomerPayment(customerId, { amount, paymentMethod });
    setCustomers(prev => prev.map(c => c.id === customerId ? result.updatedCustomer : c));
    setSales(result.allSales);
  };
  
  const updateTableStatus = async (tableId: string, status: TableStatus) => {
    const updatedTable = await api.updateTableStatus(tableId, { status });
    setTables(prev => prev.map(t => t.id === tableId ? updatedTable : t));
  };
  
  const addItemsToTable = async (tableId: string, itemsToAdd: SaleItem[], customerCount?: number) => {
    const orderExistsBefore = tableOrders.some(o => o.tableId === tableId);
    const { updatedOrder } = await api.addItemsToTable(tableId, { itemsToAdd, customerCount });
    setTableOrders(prev => {
        const existing = prev.find(o => o.tableId === tableId);
        if (existing) {
            return prev.map(o => o.tableId === tableId ? updatedOrder : o);
        }
        return [...prev, updatedOrder];
    });

    if (itemsToAdd.length > 0 || !orderExistsBefore) {
        await updateTableStatus(tableId, 'Ocupada');
    }
  };

  const updateItemOnTable = async (tableId: string, productId: string, delta: number) => {
      const updatedOrder = await api.updateItemOnTable(tableId, productId, { delta });
      setTableOrders(prev => prev.map(o => o.tableId === tableId ? updatedOrder : o));
  };
  
  const removeItemFromTable = async (tableId: string, productId: string) => {
      const result = await api.removeItemFromTable(tableId, productId);
      if (!result) return;
      
      if(result.orderDeleted) {
          setTableOrders(prev => prev.filter(o => o.tableId !== tableId));
          await updateTableStatus(tableId, 'Livre');
      } else {
          setTableOrders(prev => prev.map(o => o.tableId === tableId ? result.updatedOrder : o));
      }
  };
  
  const updateTableOrderState = (updatedOrder: TableOrder | null, newTables?: Table[], newTableOrders?: TableOrder[]) => {
      if (updatedOrder === null) {
          setTableOrders(newTableOrders || []);
          setTables(newTables || []);
      } else if (updatedOrder) {
        setTableOrders(prev => prev.map(o => o.tableId === updatedOrder.tableId ? updatedOrder : o));
      }
  };

  const handleSplitApiResponse = async (promise: Promise<any>): Promise<Sale | null> => {
      const { order, newSale, tableOrders: newTableOrders, tables: newTables } = await promise;
      updateTableOrderState(order, newTables, newTableOrders);
      if (newSale) {
          setSales(prev => [...prev, newSale]);
      }
      return newSale || null;
  }
  
  const startSplitting = async (tableId: string) => { await handleSplitApiResponse(api.splitAction(tableId, 'start')); };
  const cancelSplitting = async (tableId: string) => { await handleSplitApiResponse(api.splitAction(tableId, 'cancel')); };
  const addSplitAccount = async (tableId: string) => { await handleSplitApiResponse(api.splitAction(tableId, 'addAccount')); };
  const moveItemToSplitAccount = async (tableId: string, accountId: string, item: SaleItem) => {
      await handleSplitApiResponse(api.splitAction(tableId, 'moveItemTo', { accountId, itemToMove: item }));
  };
  const moveItemFromSplitAccount = async (tableId: string, accountId: string, item: SaleItem) => {
      await handleSplitApiResponse(api.splitAction(tableId, 'moveItemFrom', { accountId, itemToMove: item }));
  };
  
  const paySplitAccount = async (tableId: string, accountId: string, paymentMethod: PaymentMethod): Promise<Sale | null> => {
      const newSale = await handleSplitApiResponse(api.splitAction(tableId, 'payAccount', { accountId, paymentMethod }));
      const result = await api.isOrderSettled(tableId);
      if (result.settled) {
        setTableOrders(prev => prev.filter(o => o.tableId !== tableId));
        await updateTableStatus(tableId, 'Livre');
      }
      return newSale;
  };

  const saveTableLayout = async (newTables: Table[]) => {
    const updatedTables = await api.saveTableLayout(newTables);
    setTables(updatedTables);
  }
  
  const addTable = async () => {
      const newTable = await api.addTable();
      setTables(prev => [...prev, newTable]);
  };

  const deleteTable = async (tableId: string) => {
      try {
        await api.deleteTable(tableId);
        setTables(prev => prev.filter(t => t.id !== tableId));
      } catch (error: any) {
        alert(error.message);
      }
  };

  const reopenTable = async (saleId: string): Promise<boolean> => {
    try {
        const response = await api.reopenTable(saleId);
        if (!response.success) {
            alert(response.message);
            return false;
        }
        setTableOrders(response.tableOrders);
        setTables(response.tables);
        setProducts(response.products);
        setCustomers(response.customers);
        setSales(response.sales);
        return true;
    } catch (error: any) {
        alert(error.message || "Falha ao reabrir a mesa.");
        return false;
    }
  };
  
  const emitNFCe = async (saleId: string, cpf?: string) => {
      const updatedSale = await api.emitNFCe(saleId, { cpf });
      setSales(prev => prev.map(s => s.id === saleId ? updatedSale : s));
  };
  
  const addItemToTable = async (tableId: string, product: Product) => {
      const itemToAdd: SaleItem = { productId: product.id, name: product.name, quantity: 1, unitPrice: product.price };
      await addItemsToTable(tableId, [itemToAdd]);
  }

  return (
    <DataContext.Provider value={{ 
        products, customers, sales, expenses, tables, tableOrders,
        addProduct, updateProduct, deleteProduct, 
        addCustomer, updateCustomer, deleteCustomer, 
        addSale, addExpense, addCustomerPayment,
        updateTableStatus, addItemToTable, addItemsToTable, updateItemOnTable, removeItemFromTable, finalizeTableSale,
        startSplitting, cancelSplitting, addSplitAccount, moveItemToSplitAccount, moveItemFromSplitAccount, paySplitAccount,
        saveTableLayout, addTable, deleteTable,
        reopenTable, emitNFCe
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
