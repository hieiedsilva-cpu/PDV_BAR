// Fix: Change express import to default to avoid type collisions and use explicit express.Request and express.Response types.
import express from 'express';
import cors from 'cors';
import path from 'path';
import type { Product, Customer, Sale, Expense, Table, TableOrder, SaleItem, PaymentMethod, TableStatus, SplitBill } from './types';
import { initialProducts, initialCustomers, initialSales, initialExpenses, initialTables } from './mockData';

const app = express();
const port = process.env.PORT || 3001;

// In-memory data stores
let products: Product[] = [...initialProducts];
let customers: Customer[] = [...initialCustomers];
let sales: Sale[] = [...initialSales];
let expenses: Expense[] = [...initialExpenses];
let tables: Table[] = [...initialTables];
let tableOrders: TableOrder[] = [];

app.use(cors());
app.use(express.json());

// Serve static files from the React app
// Fix: Use a path that works correctly after building for production.
const staticPath = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '..', '..')
    : path.join(__dirname, '..');
app.use(express.static(staticPath));


// --- Helper Functions ---
const addSaleLogic = (items: SaleItem[], total: number, paymentMethod: PaymentMethod, customerId?: string, tableNumber?: number, customerCount?: number) => {
    const newSale: Sale = {
      id: crypto.randomUUID(),
      items,
      total,
      paymentMethod,
      customerId,
      tableNumber,
      customerCount,
      createdAt: new Date().toISOString(),
      nfceEmitted: false,
    };
    if (items.length === 0 && paymentMethod !== 'Fiado') {
        return { newSale, updatedCustomers: customers, updatedProducts: products, allSales: sales };
    }

    sales.unshift(newSale);
    
    const stockItems = items.filter(i => i.productId !== 'payment');
    if(stockItems.length > 0) {
        products = products.map(product => {
            const itemInCart = stockItems.find(item => item.productId === product.id);
            if (itemInCart) {
                return { ...product, stock: product.stock - itemInCart.quantity };
            }
            return product;
        });
    }

    if (paymentMethod === 'Fiado' && customerId) {
      customers = customers.map(c => 
        c.id === customerId ? { ...c, balance: c.balance + total } : c
      );
    }
    return { newSale, updatedCustomers: customers, updatedProducts: products, allSales: sales };
};

// --- API Endpoints ---

// Health check that the user is likely seeing
// Fix: Add explicit express types to request and response objects.
app.get('/api', (req: express.Request, res: express.Response) => {
    res.json({ status: 'online', message: 'API do Bar do Wood' });
});


// Initial data load endpoint
// Fix: Add explicit express types to request and response objects.
app.get('/api/data', (req: express.Request, res: express.Response) => {
    res.json({
        products,
        customers,
        sales,
        expenses,
        tables,
        tableOrders,
    });
});

// Products
// Fix: Add explicit express types to request and response objects.
app.get('/api/products', (req: express.Request, res: express.Response) => res.json(products));
// Fix: Add explicit express types to request and response objects.
app.post('/api/products', (req: express.Request, res: express.Response) => {
    const product = req.body;
    const newProduct: Product = { ...product, id: crypto.randomUUID() };
    products.push(newProduct);
    res.status(201).json(newProduct);
});
// Fix: Add explicit express types to request and response objects.
app.put('/api/products/:id', (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    products = products.map(p => p.id === id ? updatedProduct : p);
    res.json(updatedProduct);
});
// Fix: Add explicit express types to request and response objects.
app.delete('/api/products/:id', (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    products = products.filter(p => p.id !== id);
    res.status(204).send();
});


// Customers
// Fix: Add explicit express types to request and response objects.
app.get('/api/customers', (req: express.Request, res: express.Response) => res.json(customers));
// Fix: Add explicit express types to request and response objects.
app.post('/api/customers', (req: express.Request, res: express.Response) => {
    const customer = req.body;
    const newCustomer: Customer = { ...customer, id: crypto.randomUUID(), balance: 0 };
    customers.push(newCustomer);
    res.status(201).json(newCustomer);
});
// Fix: Add explicit express types to request and response objects.
app.put('/api/customers/:id', (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const updatedCustomer = req.body;
    customers = customers.map(c => c.id === id ? updatedCustomer : c);
    res.json(updatedCustomer);
});
// Fix: Add explicit express types to request and response objects.
app.delete('/api/customers/:id', (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    customers = customers.filter(c => c.id !== id);
    res.status(204).send();
});
// Fix: Add explicit express types to request and response objects.
app.get('/api/sales', (req: express.Request, res: express.Response) => res.json(sales));

// Sales
// Fix: Add explicit express types to request and response objects.
app.post('/api/sales', (req: express.Request, res: express.Response) => {
    const { items, total, paymentMethod, customerId, tableNumber, customerCount } = req.body;
    const result = addSaleLogic(items, total, paymentMethod, customerId, tableNumber, customerCount);
    res.status(201).json(result);
});

// Expenses
// Fix: Add explicit express types to request and response objects.
app.post('/api/expenses', (req: express.Request, res: express.Response) => {
    const expense = req.body;
    const newExpense: Expense = { ...expense, id: crypto.randomUUID(), date: new Date().toISOString() };
    expenses.unshift(newExpense);
    res.status(201).json(newExpense);
});

// Customer Payment
// Fix: Add explicit express types to request and response objects.
app.post('/api/customers/:id/payment', (req: express.Request, res: express.Response) => {
    const customerId = req.params.id;
    const { amount, paymentMethod } = req.body;
    
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    const newBalance = customer.balance - amount;
    customers = customers.map(c => c.id === customerId ? { ...c, balance: newBalance } : c);

    const result = addSaleLogic([{ productId: 'payment', name: `Pagamento via ${paymentMethod}`, quantity: 1, unitPrice: amount }], amount, paymentMethod, customerId);
    
    const updatedCustomer = customers.find(c => c.id === customerId);

    res.json({ updatedCustomer, allSales: result.allSales });
});


// Tables and Orders
// Fix: Add explicit express types to request and response objects.
app.get('/api/tables', (req: express.Request, res: express.Response) => res.json(tables));
// Fix: Add explicit express types to request and response objects.
app.get('/api/tableOrders', (req: express.Request, res: express.Response) => res.json(tableOrders));

// Update table status
// Fix: Add explicit express types to request and response objects.
app.put('/api/tables/:id/status', (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { status } = req.body;
    let foundTable = null;
    tables = tables.map(t => {
        if (t.id === id) {
            foundTable = { ...t, status };
            return foundTable;
        }
        return t;
    });
    res.json(foundTable);
});


// Add items to a table
// Fix: Add explicit express types to request and response objects.
app.post('/api/tableOrders/:tableId/items', (req: express.Request, res: express.Response) => {
    const { tableId } = req.params;
    const { itemsToAdd, customerCount } = req.body as { itemsToAdd: SaleItem[], customerCount?: number };
    
    let order = tableOrders.find(o => o.tableId === tableId);

    if (!order) {
        order = {
            id: crypto.randomUUID(),
            tableId,
            items: [],
            total: 0,
            createdAt: new Date().toISOString(),
            customerCount
        };
        tableOrders.push(order);
    }

    if (customerCount) {
        order.customerCount = customerCount;
    }
    itemsToAdd.forEach((itemToAdd: SaleItem) => {
        const existingItem = order.items.find(i => i.productId === itemToAdd.productId);
        if (existingItem) {
            existingItem.quantity += itemToAdd.quantity;
        } else {
            order.items.push(itemToAdd);
        }
    });
    order.total = order.items.reduce((sum: number, item: SaleItem) => sum + (item.unitPrice * item.quantity), 0);

    res.json({ updatedOrder: order });
});

// Update an item on a table
// Fix: Add explicit express types to request and response objects.
app.put('/api/tableOrders/:tableId/items/:productId', (req: express.Request, res: express.Response) => {
    const { tableId, productId } = req.params;
    const { delta } = req.body;
    
    const order = tableOrders.find(o => o.tableId === tableId);
    if(order) {
        order.items = order.items.map(item => item.productId === productId ? {...item, quantity: item.quantity + delta} : item)
                                .filter(item => item.quantity > 0);
        order.total = order.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        res.json(order);
    } else {
        res.status(404).send('Order not found');
    }
});

// Remove item from table
// Fix: Add explicit express types to request and response objects.
app.delete('/api/tableOrders/:tableId/items/:productId', (req: express.Request, res: express.Response) => {
    const { tableId, productId } = req.params;
    const orderIndex = tableOrders.findIndex(o => o.tableId === tableId);
    if (orderIndex === -1) return res.status(404).json({ message: 'Order not found' });
    
    let order = tableOrders[orderIndex];
    order.items = order.items.filter(item => item.productId !== productId);
    
    if (order.items.length === 0) {
        tableOrders.splice(orderIndex, 1);
        return res.json({ orderDeleted: true, updatedOrder: null });
    } else {
        order.total = order.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        return res.json({ updatedOrder: order });
    }
});

// Finalize a table sale
// Fix: Add explicit express types to request and response objects.
app.post('/api/tableOrders/:tableId/finalize', (req: express.Request, res: express.Response) => {
    const { tableId } = req.params;
    const { paymentMethod, customerId } = req.body;
    
    const order = tableOrders.find(o => o.tableId === tableId);
    const table = tables.find(t => t.id === tableId);
    if (!order || !table) return res.status(404).send('Table or order not found');

    const result = addSaleLogic(order.items, order.total, paymentMethod, customerId, table.number, order.customerCount);
    
    tableOrders = tableOrders.filter(o => o.tableId !== tableId);
    tables = tables.map(t => t.id === tableId ? { ...t, status: 'Livre' } : t);
    
    res.json({ 
        newSale: result.newSale, 
        tableOrders, 
        tables,
        products: result.updatedProducts,
        customers: result.updatedCustomers
    });
});

// Fix: Add explicit express types to request and response objects.
app.put('/api/tables', (req: express.Request, res: express.Response) => {
    const newTables = req.body;
    tables = newTables;
    res.json(tables);
});

// Fix: Add explicit express types to request and response objects.
app.post('/api/tables', (req: express.Request, res: express.Response) => {
    const maxNumber = tables.reduce((max, t) => Math.max(max, t.number), 0);
    const newTable: Table = {
        id: crypto.randomUUID(),
        number: maxNumber + 1,
        status: 'Livre',
    };
    tables.push(newTable);
    res.status(201).json(newTable);
});

// Fix: Add explicit express types to request and response objects.
app.delete('/api/tables/:id', (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const orderExists = tableOrders.some(o => o.tableId === id);
    if(orderExists) {
        return res.status(400).json({ message: 'Não é possível remover uma mesa que está ocupada.'});
    }
    tables = tables.filter(t => t.id !== id);
    res.status(204).send();
});

// Fix: Add explicit express types to request and response objects.
app.post('/api/sales/reopen', (req: express.Request, res: express.Response) => {
    const { saleId } = req.body;
    const saleIndex = sales.findIndex(s => s.id === saleId);
    if(saleIndex === -1) return res.status(404).json({ success: false, message: "Sale not found"});
    const saleToReopen = sales[saleIndex];
    
    if (!saleToReopen.tableNumber) return res.status(400).json({ success: false, message: "Sale is not a table sale."});

    const tableToReopen = tables.find(t => t.number === saleToReopen.tableNumber);
    if (!tableToReopen) {
        return res.status(400).json({ success: false, message: `A Mesa ${saleToReopen.tableNumber} não existe mais.`});
    }
    if (tableToReopen.status !== 'Livre') {
         return res.status(400).json({ success: false, message: `A Mesa ${saleToReopen.tableNumber} não está livre e não pode ser reaberta.`});
    }
    
    const newOrder: TableOrder = {
        id: crypto.randomUUID(),
        tableId: tableToReopen.id,
        items: saleToReopen.items,
        total: saleToReopen.total,
        createdAt: new Date().toISOString(),
        customerCount: saleToReopen.customerCount,
    };
    tableOrders.push(newOrder);

    tables = tables.map(t => t.id === tableToReopen.id ? { ...t, status: 'Ocupada' } : t);

    products = products.map(product => {
        const itemInSale = saleToReopen.items.find(item => item.productId === product.id && item.productId !== 'payment');
        if (itemInSale) {
            return { ...product, stock: product.stock + itemInSale.quantity };
        }
        return product;
    });
    
    if (saleToReopen.paymentMethod === 'Fiado' && saleToReopen.customerId) {
      customers = customers.map(c => 
        c.id === saleToReopen.customerId ? { ...c, balance: c.balance - saleToReopen.total } : c
      );
    }

    sales.splice(saleIndex, 1);
    
    res.json({ success: true, tableOrders, tables, products, customers, sales });
});

// Fix: Add explicit express types to request and response objects.
app.put('/api/sales/:id/nfce', (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { cpf } = req.body;
    let updatedSale = null;
    sales = sales.map(s => {
        if(s.id === id) {
            updatedSale = { ...s, cpf: cpf || undefined, nfceEmitted: true };
            return updatedSale;
        }
        return s;
    });
    res.json(updatedSale);
});

// Split Bill Logic
// Fix: Add explicit express types to request and response objects.
app.post('/api/tableOrders/:tableId/split', (req: express.Request, res: express.Response) => {
    const { tableId } = req.params;
    const { action, payload } = req.body;
    const orderIndex = tableOrders.findIndex(o => o.tableId === tableId);
    if(orderIndex === -1) return res.status(404).send({ message: 'Order not found' });
    let order = tableOrders[orderIndex];

    switch(action) {
        case 'start':
            if(!order.splitBills) order.splitBills = [];
            break;
        case 'cancel':
            order.splitBills = undefined;
            break;
        case 'addAccount':
            const newAccount: SplitBill = { id: crypto.randomUUID(), items: [], total: 0, paid: false };
            order.splitBills = order.splitBills ? [...order.splitBills, newAccount] : [newAccount];
            break;
        case 'moveItemTo': {
            const { accountId, itemToMove } = payload;
            const itemIndex = order.items.findIndex(i => i.productId === itemToMove.productId);
            if(itemIndex > -1) {
                order.items[itemIndex].quantity -= 1;
                if(order.items[itemIndex].quantity === 0) {
                    order.items.splice(itemIndex, 1);
                }
            }
            const acc = order.splitBills?.find(a => a.id === accountId);
            if(acc) {
                const accItemIndex = acc.items.findIndex(i => i.productId === itemToMove.productId);
                if(accItemIndex > -1) {
                    acc.items[accItemIndex].quantity += 1;
                } else {
                    acc.items.push({...itemToMove, quantity: 1});
                }
                acc.total = acc.items.reduce((s,i) => s + i.unitPrice * i.quantity, 0);
            }
            break;
        }
        case 'moveItemFrom': {
            const { accountId, itemToMove } = payload;
            const acc = order.splitBills?.find(a => a.id === accountId);
            if(acc) {
                const accItemIndex = acc.items.findIndex(i => i.productId === itemToMove.productId);
                if(accItemIndex > -1) {
                    acc.items[accItemIndex].quantity -= 1;
                    if(acc.items[accItemIndex].quantity === 0) {
                        acc.items.splice(accItemIndex, 1);
                    }
                }
                acc.total = acc.items.reduce((s,i) => s + i.unitPrice * i.quantity, 0);
            }
            const orderItemIndex = order.items.findIndex(i => i.productId === itemToMove.productId);
            if(orderItemIndex > -1) {
                order.items[orderItemIndex].quantity += 1;
            } else {
                order.items.push({...itemToMove, quantity: 1});
            }
            break;
        }
        case 'payAccount': {
            const { accountId, paymentMethod } = payload;
            const table = tables.find(t => t.id === tableId);
            const acc = order.splitBills?.find(a => a.id === accountId);
            let newSale: Sale | null = null;
            if(acc && table) {
                const result = addSaleLogic(acc.items, acc.total, paymentMethod, undefined, table.number, order.customerCount);
                newSale = result.newSale;
                acc.paid = true;
                acc.paymentMethod = paymentMethod;
            }
            const allPaid = order.items.length === 0 && order.splitBills?.every(acc => acc.paid);
            if (allPaid) {
                tables = tables.map(t => t.id === tableId ? { ...t, status: 'Livre' } : t);
                tableOrders = tableOrders.filter(o => o.tableId !== tableId);
                return res.json({ newSale, order: null, tableOrders, tables });
            }
            return res.json({ newSale, order });
        }
    }
    
    order.total = order.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    res.json({ order });
});

// Fix: Add explicit express types to request and response objects.
app.get('/api/tableOrders/:tableId/isSettled', (req: express.Request, res: express.Response) => {
    const { tableId } = req.params;
    const order = tableOrders.find(o => o.tableId === tableId);
    const settled = order ? (order.items.length === 0 && order.splitBills?.every(acc => acc.paid)) : false;
    if (settled) {
        tableOrders = tableOrders.filter(o => o.tableId !== tableId);
    }
    res.json({ settled });
});

// The "catchall" handler: for any request that doesn't match one of the API routes,
// send back React's index.html file.
// Fix: Add explicit express types to request and response objects.
app.get('*', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Backend do Bar do Wood está no ar! http://localhost:${port}`);
});