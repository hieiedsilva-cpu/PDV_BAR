
import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import type { Product, SaleItem, PaymentMethod, Customer, Table, TableStatus, TableOrder, SplitBill, Sale } from '../types';
import { useData } from '../context/DataContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Trash2, Plus, Minus, CreditCard, BookUser, Search, X, Clock, FileText, Spline, MoveRight, Settings, Check, ShoppingCart, Banknote, QrCode, Users, ArrowLeft } from 'lucide-react';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import PaymentModal from '../components/PaymentModal';
import QuickSaleModal from '../components/QuickSaleModal';
import NFCeModal from '../components/NFCeModal';


// --- Set Customer Count Modal ---
interface SetCustomerCountModalProps {
    table: Table;
    onClose: () => void;
    onConfirm: (count: number) => void;
    onSkip: () => void;
}

const SetCustomerCountModal: React.FC<SetCustomerCountModalProps> = ({ table, onClose, onConfirm, onSkip }) => {
    const [count, setCount] = useState('');

    const handleConfirmSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numCount = parseInt(count, 10);
        if (!isNaN(numCount) && numCount > 0) {
            onConfirm(numCount);
        }
    };
    
    const numCount = parseInt(count, 10);
    const isConfirmDisabled = count === '' || isNaN(numCount) || numCount <= 0;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <form className="bg-dark-800 p-8 rounded-lg w-full max-w-sm" onClick={e => e.stopPropagation()} onSubmit={handleConfirmSubmit}>
                <h3 className="text-xl font-bold mb-2">Ocupar Mesa {table.number}</h3>
                <p className="text-gray-400 mb-6">Insira o número de pessoas na mesa.</p>
                
                <div>
                    <label htmlFor="customerCount" className="block text-sm font-medium text-gray-400 mb-1">
                        Número de Pessoas
                    </label>
                    <input
                        id="customerCount"
                        type="number"
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                        placeholder="Ex: 4"
                        min="1"
                        className="w-full p-3 text-2xl text-center bg-dark-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                    />
                </div>
                
                <div className="flex justify-end gap-4 mt-8">
                    <Button type="button" variant="ghost" onClick={onSkip}>Pular</Button>
                    <Button type="submit" disabled={isConfirmDisabled}>Confirmar</Button>
                </div>
            </form>
        </div>
    );
}

// --- Add Product To Order Modal ---
interface AddProductToOrderModalProps {
    table: Table;
    onClose: () => void;
    onConfirmAdd: (items: SaleItem[]) => void;
}

const AddProductToOrderModal: React.FC<AddProductToOrderModalProps> = ({ table, onClose, onConfirmAdd }) => {
    const { products } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [pendingItems, setPendingItems] = useState<SaleItem[]>([]);
    
    const categories = useMemo(() => ['Todos', ...Array.from(new Set(products.map(p => p.category)))], [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === 'Todos' || p.category === selectedCategory)
        );
    }, [products, searchTerm, selectedCategory]);
    
    const groupedProducts = useMemo(() => {
        if (selectedCategory !== 'Todos') return null;
        return filteredProducts.reduce((acc, product) => {
            const category = product.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {} as Record<string, Product[]>);
    }, [filteredProducts, selectedCategory]);

    const handleProductClick = (product: Product) => {
        setPendingItems(prev => {
            const existingItem = prev.find(item => item.productId === product.id);
            if (existingItem) {
                return prev.map(item =>
                    item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { productId: product.id, name: product.name, quantity: 1, unitPrice: product.price }];
        });
    };

    const updatePendingItemQuantity = (productId: string, delta: number) => {
        setPendingItems(prev => 
            prev.map(item => item.productId === productId ? {...item, quantity: item.quantity + delta} : item)
                .filter(item => item.quantity > 0)
        );
    };
    
    const handleConfirm = () => {
        if(pendingItems.length > 0) {
            onConfirmAdd(pendingItems);
        }
        onClose();
    };
    
    const pendingTotal = useMemo(() => 
        pendingItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0), 
    [pendingItems]);


    return (
         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-dark-800 p-6 rounded-lg w-full max-w-6xl h-5/6 flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Adicionar à Mesa {table.number}</h3>
                    <Button variant="ghost" size="icon" onClick={onClose}><X size={20}/></Button>
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
                    {/* Left Column: Product Selection */}
                    <div className="flex flex-col min-h-0">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                            <input
                                type="text"
                                placeholder="Buscar produto..."
                                className="w-full p-2 pl-10 bg-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                         <div className="flex flex-wrap border-b border-dark-700 mb-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${selectedCategory === cat ? 'text-primary border-primary' : 'text-gray-400 hover:text-white border-transparent'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2">
                           {groupedProducts ? (
                                Object.entries(groupedProducts).map(([category, productsInCategory]) => (
                                    <div key={category} className="mb-4">
                                        <h4 className="text-md font-bold my-3 pt-2 border-t border-dark-700 text-gray-400">{category}</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {productsInCategory.map(p => (
                                                <div key={p.id} onClick={() => handleProductClick(p)} className="bg-dark-700 hover:bg-dark-600 p-2 rounded-lg cursor-pointer text-left transition-colors h-20 flex flex-col justify-between">
                                                    <h5 className="font-semibold text-sm leading-tight">{p.name}</h5>
                                                    <p className="font-bold text-primary text-xs mt-1">R$ {p.price.toFixed(2)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {filteredProducts.map(p => (
                                        <div key={p.id} onClick={() => handleProductClick(p)} className="bg-dark-700 hover:bg-dark-600 p-2 rounded-lg cursor-pointer text-left transition-colors h-20 flex flex-col justify-between">
                                            <h5 className="font-semibold text-sm leading-tight">{p.name}</h5>
                                            <p className="font-bold text-primary text-xs mt-1">R$ {p.price.toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Right Column: Pending Items */}
                    <div className="flex flex-col bg-dark-900/50 p-4 rounded-lg min-h-0">
                         <h4 className="text-lg font-semibold mb-2">Itens para Adicionar</h4>
                         <div className="flex-1 overflow-y-auto pr-2">
                            {pendingItems.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-gray-500">Nenhum item selecionado.</div>
                            ) : (
                                <div className="space-y-2">
                                    {pendingItems.map(item => (
                                         <div key={item.productId} className="flex justify-between items-center p-2 bg-dark-700 rounded-md">
                                             <div>
                                                 <p className="font-semibold">{item.name}</p>
                                                 <p className="text-xs text-gray-400">R$ {item.unitPrice.toFixed(2)}</p>
                                             </div>
                                             <div className="flex items-center gap-2">
                                                 <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updatePendingItemQuantity(item.productId, -1)}><Minus size={16}/></Button>
                                                 <span className="font-bold w-5 text-center">{item.quantity}</span>
                                                 <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updatePendingItemQuantity(item.productId, 1)}><Plus size={16}/></Button>
                                             </div>
                                         </div>
                                    ))}
                                </div>
                            )}
                         </div>
                         <div className="mt-auto pt-4 border-t border-dark-700">
                             <div className="flex justify-between text-xl font-bold mb-4">
                                <span>Total:</span>
                                <span>R$ {pendingTotal.toFixed(2)}</span>
                             </div>
                             <Button onClick={handleConfirm} disabled={pendingItems.length === 0} className="w-full h-12 text-lg">
                                Adicionar {pendingItems.length > 0 ? `(${pendingItems.length})` : ''} Itens
                             </Button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Order Details Modal ---
interface OrderDetailsModalProps {
    table: Table;
    order: TableOrder | undefined;
    onClose: () => void;
    setSaleForNFCe: (sale: Sale) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ table, order, onClose, setSaleForNFCe }) => {
    const { 
        customers, updateItemOnTable, removeItemFromTable, finalizeTableSale,
        startSplitting, addSplitAccount, moveItemToSplitAccount, moveItemFromSplitAccount, paySplitAccount,
        cancelSplitting
    } = useData();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
    
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Dinheiro');
    const [customerId, setCustomerId] = useState<string | undefined>();
    const [amountReceived, setAmountReceived] = useState('');
    
    if (!order) return null;

    const { items, total, splitBills, tableId } = order;
    
    const isSplitting = splitBills !== undefined;

    useEffect(() => {
        if (paymentMethod !== 'Dinheiro') {
            setAmountReceived('');
        }
    }, [paymentMethod]);

    const handleFinalize = async () => {
        if (paymentMethod === 'Fiado' && !customerId) {
            alert('Por favor, selecione um cliente para a conta fiado.');
            return;
        }
        const newSale = await finalizeTableSale(tableId, paymentMethod, customerId);
        if (newSale) {
            setSaleForNFCe(newSale);
        }
        onClose();
    };
    
    const handleCancelSplitting = () => {
        if (order.splitBills?.some(bill => bill.paid)) {
            alert('Não é possível cancelar a divisão pois um pagamento parcial já foi registrado. Finalize os pagamentos restantes individualmente.');
            return;
        }
        cancelSplitting(tableId);
    };

    const handlePaySplit = async (accountId: string, splitPaymentMethod: PaymentMethod) => {
        const newSale = await paySplitAccount(tableId, accountId, splitPaymentMethod);
        if (newSale) {
            setSaleForNFCe(newSale);
            closeSplitPayment(accountId);
        }
    }
    
    const [splitPaymentStates, setSplitPaymentStates] = useState<Record<string, {method: PaymentMethod, isOpen: boolean}>>({});
    
    const openSplitPayment = (accountId: string) => {
        setSplitPaymentStates(prev => ({...prev, [accountId]: {method: 'Dinheiro', isOpen: true}}));
    }
    const closeSplitPayment = (accountId: string) => {
        setSplitPaymentStates(prev => ({...prev, [accountId]: {...prev[accountId], isOpen: false}}));
    }
    const setSplitPaymentMethod = (accountId: string, method: PaymentMethod) => {
         setSplitPaymentStates(prev => ({...prev, [accountId]: {...prev[accountId], method}}));
    }
    
    const unpaidItemsTotal = isSplitting ? items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0) : 0;


    return (
        <>
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-dark-800 p-6 rounded-lg w-full max-w-4xl h-5/6 flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-xl font-bold">Conta da Mesa {table.number}</h3>
                        {order.customerCount && <p className="text-sm text-gray-400">{order.customerCount} pessoa(s) na mesa</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        {isSplitting ? (
                            <Button variant="outline" onClick={handleCancelSplitting}><ArrowLeft size={16} className="mr-2"/> Voltar para Comanda</Button>
                        ) : (
                            <Button variant="outline" onClick={() => startSplitting(tableId)}><Spline size={16} className="mr-2"/> Dividir Conta</Button>
                        )}
                         <Button onClick={() => setIsAddModalOpen(true)}><Plus size={16} className="mr-2"/> Adicionar Itens</Button>
                        <Button variant="ghost" size="icon" onClick={onClose}><X size={20}/></Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                   {isSplitting ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                            {/* Main Unsplit Items */}
                            <div className="bg-dark-700/50 p-3 rounded-lg">
                                <h4 className="font-bold mb-2">Itens Restantes</h4>
                                {items.length > 0 ? items.map(item => (
                                     <div key={item.productId} className="text-sm p-2 flex justify-between items-center hover:bg-dark-600 rounded">
                                        <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                                        <span className="font-semibold">R$ {(item.unitPrice * item.quantity).toFixed(2)}</span>
                                    </div>
                                )) : <p className="text-xs text-gray-500 text-center py-4">Todos os itens foram divididos.</p>}
                                <div className="border-t border-dark-600 mt-2 pt-2 flex justify-between font-bold">
                                    <span>Total Restante:</span>
                                    <span>R$ {unpaidItemsTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            {/* Split Accounts */}
                            {(splitBills || []).map((acc, index) => (
                                <div key={acc.id} className={`p-3 rounded-lg ${acc.paid ? 'bg-green-500/10' : 'bg-dark-700/50'}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold">Conta {index + 1}</h4>
                                        {acc.paid && <span className="text-xs font-bold text-green-400 px-2 py-1 bg-green-900/50 rounded-full">PAGO ({acc.paymentMethod})</span>}
                                    </div>
                                    
                                    {!acc.paid && items.map(item => (
                                        <div key={item.productId} className="text-xs p-1 flex justify-between items-center" title="Mover para esta conta">
                                             <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                                            <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => moveItemToSplitAccount(tableId, acc.id, item)}><MoveRight size={14} /></Button>
                                        </div>
                                    ))}
                                    <div className="mt-2 pt-2 border-t border-dark-600 space-y-1">
                                    {acc.items.map(item => (
                                        <div key={item.productId} className="text-xs p-1 flex justify-between items-center bg-dark-800/50 rounded" title="Mover de volta">
                                            <Button size="icon" variant="ghost" className="h-5 w-5 text-red-400" onClick={() => moveItemFromSplitAccount(tableId, acc.id, item)}><X size={14} /></Button>
                                            <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                                        </div>
                                    ))}
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-dark-600 flex justify-between font-bold">
                                        <span>Total:</span>
                                        <span>R$ {acc.total.toFixed(2)}</span>
                                    </div>
                                    {!acc.paid && (
                                        <>
                                        {splitPaymentStates[acc.id]?.isOpen ? (
                                            <div className="mt-2 p-2 bg-dark-900/50 rounded-md">
                                                <div className="grid grid-cols-3 gap-1 mb-2">
                                                    <Button size="sm" variant={splitPaymentStates[acc.id].method === 'Dinheiro' ? 'secondary' : 'ghost'} onClick={() => setSplitPaymentMethod(acc.id, 'Dinheiro')}>Dinheiro</Button>
                                                    <Button size="sm" variant={splitPaymentStates[acc.id].method === 'Cartão' ? 'secondary' : 'ghost'} onClick={() => setSplitPaymentMethod(acc.id, 'Cartão')}>Cartão</Button>
                                                    <Button size="sm" variant={splitPaymentStates[acc.id].method === 'PIX' ? 'secondary' : 'ghost'} onClick={() => setSplitPaymentMethod(acc.id, 'PIX')}>PIX</Button>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="ghost" className="flex-1" onClick={() => closeSplitPayment(acc.id)}>Cancelar</Button>
                                                    <Button size="sm" className="flex-1" onClick={() => handlePaySplit(acc.id, splitPaymentStates[acc.id].method)}>Confirmar</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button size="sm" className="w-full mt-2" onClick={() => openSplitPayment(acc.id)} disabled={acc.items.length === 0}>Pagar Conta {index + 1}</Button>
                                        )}
                                        </>
                                    )}
                                </div>
                            ))}
                             {splitBills && !splitBills.every(b => b.paid) && (
                                <Button variant="ghost" className="h-full border-2 border-dashed border-dark-600" onClick={() => addSplitAccount(tableId)}>
                                    <Plus size={20} /> Adicionar Conta
                                </Button>
                             )}
                        </div>
                   ) : (
                        <div className="w-full text-left">
                            <div className="grid grid-cols-12 gap-2 p-2 font-semibold text-gray-400 bg-dark-700/50">
                                <div className="col-span-6">Produto</div>
                                <div className="col-span-3 text-center">Quantidade</div>
                                <div className="col-span-2 text-right">Subtotal</div>
                                <div className="col-span-1"></div>
                            </div>
                            <div className="flex flex-col gap-1 mt-1">
                                {items.map(item => (
                                    <div key={item.productId} className="grid grid-cols-12 gap-2 items-center p-2 bg-dark-700/50 rounded">
                                        <div className="col-span-6 font-medium">{item.name}</div>
                                        <div className="col-span-3 flex items-center justify-center gap-2">
                                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateItemOnTable(tableId, item.productId, -1)}><Minus size={14} /></Button>
                                            <span className="w-5 text-center font-bold">{item.quantity}</span>
                                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateItemOnTable(tableId, item.productId, 1)}><Plus size={14} /></Button>
                                        </div>
                                        <div className="col-span-2 text-right font-semibold">R$ {(item.unitPrice * item.quantity).toFixed(2)}</div>
                                        <div className="col-span-1 text-right">
                                            <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-300 h-6 w-6" onClick={() => removeItemFromTable(tableId, item.productId)}><Trash2 size={14} /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                   )}
                </div>

                <div className="mt-auto pt-4 border-t border-dark-700">
                    <div className="flex justify-between text-2xl font-bold mb-4">
                        <span>Total:</span>
                        <span className="text-primary">R$ {total.toFixed(2)}</span>
                    </div>
                     {isFinalizeModalOpen ? (
                        <Card className="bg-dark-700">
                            <h4 className="font-semibold mb-3">Finalizar Pagamento</h4>
                            <div className="grid grid-cols-4 gap-2 mb-3">
                                <Button variant={paymentMethod === 'Dinheiro' ? 'primary' : 'ghost'} onClick={() => setPaymentMethod('Dinheiro')}><Banknote className="mr-2" size={16}/> Dinheiro</Button>
                                <Button variant={paymentMethod === 'Cartão' ? 'primary' : 'ghost'} onClick={() => setPaymentMethod('Cartão')}><CreditCard className="mr-2" size={16}/> Cartão</Button>
                                <Button variant={paymentMethod === 'PIX' ? 'primary' : 'ghost'} onClick={() => setPaymentMethod('PIX')}><QrCode className="mr-2" size={16}/> PIX</Button>
                                <Button variant={paymentMethod === 'Fiado' ? 'primary' : 'ghost'} onClick={() => setPaymentMethod('Fiado')}><BookUser className="mr-2" size={16}/> Fiado</Button>
                            </div>
                             {paymentMethod === 'Dinheiro' && (
                                <div className="grid grid-cols-2 gap-4 my-3 p-4 bg-dark-900/50 rounded-lg">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Valor Recebido</label>
                                        <input
                                            type="number"
                                            value={amountReceived}
                                            onChange={(e) => setAmountReceived(e.target.value)}
                                            placeholder="R$ 0,00"
                                            className="w-full p-2 bg-dark-700 rounded focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Troco</label>
                                        <div className="w-full p-2 bg-dark-700 rounded text-lg h-[42px] flex items-center text-secondary font-bold">
                                            R$ {Math.max(0, (parseFloat(amountReceived) || 0) - total).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {paymentMethod === 'Fiado' && (
                                <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="w-full p-2 bg-dark-600 rounded mb-3">
                                    <option value="">Selecione o cliente</option>
                                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            )}
                            <div className="flex gap-4">
                               <Button variant="ghost" onClick={() => setIsFinalizeModalOpen(false)} className="w-full">Cancelar</Button>
                               <Button onClick={handleFinalize} className="w-full">Confirmar Pagamento</Button>
                            </div>
                        </Card>
                    ) : (
                        <Button
                            size="lg"
                            className="w-full h-12 text-lg"
                            onClick={() => setIsFinalizeModalOpen(true)}
                            disabled={isSplitting && items.length > 0}
                        >
                            {isSplitting && items.length > 0 ? `Itens restantes devem ser divididos (R$ ${unpaidItemsTotal.toFixed(2)})` : 'Fechar Conta'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
        
        {isAddModalOpen && order && (
            <AddProductToOrderModal 
                table={table}
                onClose={() => setIsAddModalOpen(false)}
                onConfirmAdd={(itemsToAdd) => {
                    const { addItemsToTable } = useData();
                    addItemsToTable(order.tableId, itemsToAdd);
                }}
            />
        )}
        </>
    );
};

// --- Table Component ---
const TableComponent: React.FC<{ table: Table, setSaleForNFCe: (sale: Sale) => void }> = ({ table, setSaleForNFCe }) => {
    const { tableOrders, addItemsToTable } = useData();
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isCustomerCountModalOpen, setIsCustomerCountModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [justOpened, setJustOpened] = useState(false);

    const order = useMemo(() => tableOrders.find(o => o.tableId === table.id), [tableOrders, table.id]);
    
    const statusClasses: Record<TableStatus, string> = {
        'Livre': 'bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30',
        'Ocupada': 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30',
        'Atenção': 'bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30 animate-pulse',
        'Conta Pedida': 'bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30',
    };
    
    const handleClick = () => {
        if(table.status === 'Livre') {
            setIsCustomerCountModalOpen(true);
        } else {
            setIsOrderModalOpen(true);
        }
    };
    
    const handleOpenTable = (customerCount?: number) => {
        setIsCustomerCountModalOpen(false);
        addItemsToTable(table.id, [], customerCount); 
        setIsAddModalOpen(true);
        setJustOpened(true);
    };
    
    const handleConfirmAdd = (items: SaleItem[]) => {
        addItemsToTable(table.id, items);
        setIsAddModalOpen(false);
        if (justOpened) {
            setIsOrderModalOpen(true);
            setJustOpened(false);
        }
    }


    return (
        <>
            <div
                onClick={handleClick}
                className={`p-4 rounded-lg border-2 text-center cursor-pointer transition-all duration-200 flex flex-col justify-between h-32 ${statusClasses[table.status]} ${justOpened ? 'animate-pulse-green':''}`}
            >
                <div>
                    <span className="block font-bold text-2xl">{table.number}</span>
                    <span className="text-xs">{table.status}</span>
                </div>
                <div className="flex justify-between items-center">
                    {order && order.customerCount ? (
                        <div className="flex items-center text-xs text-gray-300">
                            <Users size={14} className="mr-1"/>
                            <span>{order.customerCount}</span>
                        </div>
                    ) : <div/>}
                    {order && <span className="font-semibold text-sm">R$ {order.total.toFixed(2)}</span>}
                </div>
            </div>
            {isOrderModalOpen && order && <OrderDetailsModal table={table} order={order} onClose={() => setIsOrderModalOpen(false)} setSaleForNFCe={setSaleForNFCe} />}
            {isCustomerCountModalOpen && <SetCustomerCountModal
                table={table}
                onClose={() => setIsCustomerCountModalOpen(false)}
                onConfirm={(count) => handleOpenTable(count)}
                onSkip={() => handleOpenTable()}
            />}
            {isAddModalOpen && <AddProductToOrderModal table={table} onClose={() => setIsAddModalOpen(false)} onConfirmAdd={handleConfirmAdd} />}
        </>
    );
};


// --- Main POS Page ---
const POS: React.FC = () => {
  const { tables, saveTableLayout, addTable, deleteTable, reopenTable } = useData();
  const [isQuickSaleModalOpen, setIsQuickSaleModalOpen] = useState(false);
  const [isSettingsMode, setIsSettingsMode] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<Table | null>(null);
  const [saleForNFCe, setSaleForNFCe] = useState<Sale | null>(null);

  // Simple drag and drop state
  const [draggedTable, setDraggedTable] = useState<Table | null>(null);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, table: Table) => {
    if (!isSettingsMode) e.preventDefault();
    setDraggedTable(table);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetTable: Table) => {
    e.preventDefault();
    if (!draggedTable || !targetTable || draggedTable.id === targetTable.id) return;
    
    const newTables = [...tables];
    const draggedIndex = newTables.findIndex(t => t.id === draggedTable.id);
    const targetIndex = newTables.findIndex(t => t.id === targetTable.id);
    
    // Swap positions
    [newTables[draggedIndex], newTables[targetIndex]] = [newTables[targetIndex], newTables[draggedIndex]];

    saveTableLayout(newTables);
    setDraggedTable(null);
  };
  
  const handleConfirmDelete = () => {
    if (tableToDelete) {
      deleteTable(tableToDelete.id);
      setTableToDelete(null);
    }
  };


  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Ponto de Venda (PDV)</h2>
            <div className="flex gap-4">
                 <Button onClick={() => setIsReopenModalOpen(true)} variant="outline">
                    <Clock className="mr-2" size={18}/> Reabrir Mesa
                </Button>
                <Button onClick={() => setIsQuickSaleModalOpen(true)}>
                    <ShoppingCart className="mr-2" size={18}/> Venda Rápida
                </Button>
                <Button variant={isSettingsMode ? 'secondary' : 'ghost'} size="icon" onClick={() => setIsSettingsMode(!isSettingsMode)} title={isSettingsMode ? "Salvar Layout" : "Editar Layout das Mesas"}>
                    {isSettingsMode ? <Check size={20}/> : <Settings size={20}/>}
                </Button>
            </div>
        </div>

        {isSettingsMode && (
             <div className="p-3 bg-secondary/20 text-secondary-200 rounded-lg text-center text-sm">
                Modo de Edição: Adicione, remova ou arraste as mesas para reorganizar. Clique em <Check size={14} className="inline-block"/> para salvar e sair.
            </div>
        )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tables.map(table => (
          <div 
             key={table.id}
             draggable={isSettingsMode}
             onDragStart={(e) => handleDragStart(e, table)}
             onDragOver={(e) => e.preventDefault()}
             onDrop={(e) => handleDrop(e, table)}
             className={`relative ${isSettingsMode ? 'cursor-move' : ''}`}
          >
             {isSettingsMode && (
                <Button
                    size="icon"
                    variant="danger"
                    className="absolute -top-2 -right-2 h-7 w-7 z-10"
                    onClick={(e) => {
                        e.stopPropagation();
                        setTableToDelete(table);
                    }}
                    title={`Remover Mesa ${table.number}`}
                >
                    <X size={14} />
                </Button>
            )}
            <TableComponent table={table} setSaleForNFCe={setSaleForNFCe} />
          </div>
        ))}
         {isSettingsMode && (
          <div
            className="p-4 rounded-lg border-2 border-dashed border-dark-600 text-center cursor-pointer transition-all duration-200 flex flex-col justify-center items-center h-32 hover:bg-dark-700 hover:border-primary"
            onClick={addTable}
          >
            <Plus size={40} className="text-gray-500" />
            <span className="mt-2 text-sm font-semibold">Adicionar Mesa</span>
          </div>
        )}
      </div>
      {isQuickSaleModalOpen && <QuickSaleModal onClose={() => setIsQuickSaleModalOpen(false)} setSaleForNFCe={setSaleForNFCe} />}
      {isReopenModalOpen && (
        <RecentlyClosedTablesModal
            onClose={() => setIsReopenModalOpen(false)}
            onReopen={(saleId) => {
                if (reopenTable(saleId)) {
                    setIsReopenModalOpen(false);
                }
            }}
        />
       )}
       {tableToDelete && (
            <ConfirmationModal
                title={`Remover Mesa ${tableToDelete.number}`}
                message="Tem certeza que deseja remover esta mesa? Esta ação não pode ser desfeita e só é permitida em mesas livres."
                onConfirm={handleConfirmDelete}
                onCancel={() => setTableToDelete(null)}
                confirmText="Remover"
                variant="danger"
            />
        )}
        {saleForNFCe && <NFCeModal saleId={saleForNFCe.id} onClose={() => setSaleForNFCe(null)} />}
    </div>
  );
};


interface RecentlyClosedTablesModalProps {
    onClose: () => void;
    onReopen: (saleId: string) => void;
}

const RecentlyClosedTablesModal: React.FC<RecentlyClosedTablesModalProps> = ({ onClose, onReopen }) => {
    const { sales } = useData();

    // Filter for sales that were associated with a table and are recent (e.g., last 24h)
    const recentlyClosedTables = useMemo(() => {
        const oneDayAgo = new Date().getTime() - 24 * 60 * 60 * 1000;
        return sales
            .filter(s => s.tableNumber && new Date(s.createdAt).getTime() > oneDayAgo)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [sales]);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-dark-800 p-6 rounded-lg w-full max-w-2xl h-4/5 flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Reabrir Mesa Fechada Recentemente</h3>
                    <Button variant="ghost" size="icon" onClick={onClose}><X size={20}/></Button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2">
                    {recentlyClosedTables.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-dark-700 sticky top-0">
                                <tr>
                                    <th className="p-3">Mesa</th>
                                    <th className="p-3">Total</th>
                                    <th className="p-3">Fechada em</th>
                                    <th className="p-3 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentlyClosedTables.map(sale => (
                                    <tr key={sale.id} className="border-b border-dark-700 hover:bg-dark-700/50">
                                        <td className="p-3 font-semibold">{sale.tableNumber}</td>
                                        <td className="p-3 text-primary font-bold">R$ {sale.total.toFixed(2)}</td>
                                        <td className="p-3 text-gray-400">{new Date(sale.createdAt).toLocaleTimeString('pt-BR')}</td>
                                        <td className="p-3 text-right">
                                            <Button size="sm" onClick={() => onReopen(sale.id)}>Reabrir</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Nenhuma mesa fechada nas últimas 24 horas.
                        </div>
                    )}
                </div>
                 <div className="flex justify-end gap-4 mt-6">
                    <Button variant="ghost" onClick={onClose}>Fechar</Button>
                </div>
            </div>
        </div>
    );
};


export default POS;