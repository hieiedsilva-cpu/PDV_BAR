
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import type { SaleItem, PaymentMethod, Product, Customer, Sale } from '../types';
import Button from './ui/Button';
import PaymentModal from './PaymentModal';
import CustomerModal from './CustomerModal';
import { X, Search, Plus, Minus, Banknote, CreditCard, QrCode, User } from 'lucide-react';

interface QuickSaleModalProps {
    onClose: () => void;
    setSaleForNFCe: (sale: Sale) => void;
}

const QuickSaleModal: React.FC<QuickSaleModalProps> = ({ onClose, setSaleForNFCe }) => {
    const { products, customers, addSale, addCustomer } = useData();
    const [cart, setCart] = useState<SaleItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('Dinheiro');
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>();

    const categories = useMemo(() => ['Todos', ...Array.from(new Set(products.map(p => p.category)))], [products]);

    const filteredProducts = useMemo(() => {
        return products
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(p => selectedCategory === 'Todos' || p.category === selectedCategory);
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

    const total = useMemo(() =>
        cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    , [cart]);

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.productId === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { productId: product.id, name: product.name, quantity: 1, unitPrice: product.price }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prevCart => {
            const newCart = prevCart.map(item =>
                item.productId === productId ? { ...item, quantity: item.quantity + delta } : item
            );
            return newCart.filter(item => item.quantity > 0);
        });
    };

    const handleFinalizeSale = async () => {
        if (cart.length === 0) return;

        if (selectedPaymentMethod === 'Fiado') {
            if (selectedCustomerId) {
                const newSale = await addSale(cart, total, 'Fiado', selectedCustomerId);
                setSaleForNFCe(newSale);
                onClose();
            }
        } else {
            setIsPaymentModalOpen(true);
        }
    };
    
    const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'balance'> | Customer) => {
        if (!('id' in customerData)) {
          addCustomer(customerData);
        }
        setIsCustomerModalOpen(false);
    };

    const handleConfirmPayment = async () => {
        if (selectedPaymentMethod === 'Fiado') return;
        const newSale = await addSale(cart, total, selectedPaymentMethod, undefined, undefined);
        setIsPaymentModalOpen(false);
        setSaleForNFCe(newSale);
        onClose();
    };

    return (
        <>
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-dark-800 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-dark-700">
                    <h3 className="text-xl font-bold">Venda Rápida / Balcão</h3>
                    <Button variant="ghost" size="icon" onClick={onClose}><X size={20}/></Button>
                </div>

                <div className="flex-1 grid grid-cols-5 gap-6 p-4 min-h-0">
                    {/* Left Panel */}
                    <div className="col-span-3 flex flex-col min-h-0">
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
                        <div className="flex border-b border-dark-700 mb-2">
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
                                        <div className="grid grid-cols-3 gap-3">
                                            {productsInCategory.map(p => (
                                                <div key={p.id} onClick={() => addToCart(p)} className="bg-dark-700 hover:bg-dark-600 p-3 rounded-lg cursor-pointer text-left transition-colors h-24 flex flex-col justify-between">
                                                    <h5 className="font-semibold text-sm leading-tight">{p.name}</h5>
                                                    <p className="font-bold text-primary mt-1">R$ {p.price.toFixed(2)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="grid grid-cols-3 gap-3">
                                    {filteredProducts.map(p => (
                                        <div key={p.id} onClick={() => addToCart(p)} className="bg-dark-700 hover:bg-dark-600 p-3 rounded-lg cursor-pointer text-left transition-colors h-24 flex flex-col justify-between">
                                            <h5 className="font-semibold text-sm leading-tight">{p.name}</h5>
                                            <p className="font-bold text-primary mt-1">R$ {p.price.toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="col-span-2 flex flex-col bg-dark-900/50 p-4 rounded-lg min-h-0">
                        <h4 className="text-lg font-semibold mb-2">Comanda</h4>
                        <div className="flex-1 overflow-y-auto pr-2">
                            {cart.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-gray-500">Nenhum item adicionado.</div>
                            ) : (
                                <div className="w-full text-left text-sm">
                                    <div className="grid grid-cols-12 gap-2 px-2 py-2 font-semibold text-gray-400 bg-dark-900/50">
                                        <div className="col-span-5">Produto</div>
                                        <div className="col-span-4 text-center">Qtd</div>
                                        <div className="col-span-3 text-right">Subtotal</div>
                                    </div>
                                    <div className="flex flex-col gap-1 mt-1">
                                        {cart.map(item => (
                                            <div key={item.productId} className="grid grid-cols-12 gap-2 items-center px-2 py-1 bg-dark-700/50 rounded">
                                                <div className="col-span-5 font-medium truncate">{item.name}</div>
                                                <div className="col-span-4 flex items-center justify-center gap-1">
                                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.productId, -1)}><Minus size={14} /></Button>
                                                    <span className="w-5 text-center font-bold">{item.quantity}</span>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.productId, 1)}><Plus size={14} /></Button>
                                                </div>
                                                <div className="col-span-3 text-right font-semibold">R$ {(item.unitPrice * item.quantity).toFixed(2)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-auto pt-4 border-t border-dark-700">
                            <div className="flex justify-between text-2xl font-bold mb-4">
                                <span>Total:</span>
                                <span>R$ {total.toFixed(2)}</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                <Button title="Dinheiro" variant={selectedPaymentMethod === 'Dinheiro' ? 'primary' : 'ghost'} onClick={() => setSelectedPaymentMethod('Dinheiro')}><Banknote /></Button>
                                <Button title="Cartão" variant={selectedPaymentMethod === 'Cartão' ? 'primary' : 'ghost'} onClick={() => setSelectedPaymentMethod('Cartão')}><CreditCard /></Button>
                                <Button title="PIX" variant={selectedPaymentMethod === 'PIX' ? 'primary' : 'ghost'} onClick={() => setSelectedPaymentMethod('PIX')}><QrCode /></Button>
                                <Button title="Fiado" variant={selectedPaymentMethod === 'Fiado' ? 'primary' : 'ghost'} onClick={() => setSelectedPaymentMethod('Fiado')}><User /></Button>
                            </div>
                            {selectedPaymentMethod === 'Fiado' && (
                                <div className="flex gap-2 items-center mb-4">
                                    <select
                                        value={selectedCustomerId || ''}
                                        onChange={(e) => setSelectedCustomerId(e.target.value)}
                                        className="w-full p-2 bg-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-11"
                                    >
                                        <option value="">Selecione um cliente...</option>
                                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <Button size="icon" onClick={() => setIsCustomerModalOpen(true)}><Plus size={16} /></Button>
                                </div>
                            )}
                            <Button
                                size="lg"
                                className="w-full h-12 text-lg"
                                onClick={handleFinalizeSale}
                                disabled={cart.length === 0 || (selectedPaymentMethod === 'Fiado' && !selectedCustomerId)}
                            >
                               {selectedPaymentMethod === 'Fiado' ? 'Lançar na Conta' : 'Finalizar Venda'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {isPaymentModalOpen && (
            <PaymentModal
                total={total}
                paymentMethod={selectedPaymentMethod}
                onClose={() => setIsPaymentModalOpen(false)}
                onConfirm={handleConfirmPayment}
            />
        )}
        {isCustomerModalOpen && <CustomerModal customer={null} onSave={handleSaveCustomer} onClose={() => setIsCustomerModalOpen(false)} />}
        </>
    );
};

export default QuickSaleModal;