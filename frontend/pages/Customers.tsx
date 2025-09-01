import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import type { Customer, PaymentMethod, Sale } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Plus, MessageSquare, Banknote, CreditCard, QrCode, Edit, Trash2, Search, User, Wallet, AlertTriangle } from 'lucide-react';
import CustomerModal from '../components/CustomerModal';
import ConfirmationModal from '../components/ui/ConfirmationModal';


// Modal for settling customer debt
interface SettleDebtModalProps {
  customer: Customer;
  onSave: (customer: Customer, amount: number, paymentMethod: PaymentMethod) => void;
  onClose: () => void;
}

const SettleDebtModal: React.FC<SettleDebtModalProps> = ({ customer, onSave, onClose }) => {
  const [amount, setAmount] = useState(customer.balance.toFixed(2));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Dinheiro');

  const handleSave = () => {
    const amountNum = parseFloat(amount);
    if (!isNaN(amountNum) && amountNum > 0) {
      onSave(customer, amountNum, paymentMethod);
    }
  };
  
  const amountNum = parseFloat(amount) || 0;
  const isSaveDisabled = amountNum <= 0 || amountNum > customer.balance;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-dark-800 p-8 rounded-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-2">Registrar Pagamento</h3>
        <p className="text-gray-400 mb-6">Cliente: <span className="text-primary font-semibold">{customer.name}</span></p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Valor a Pagar</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="R$ 0,00"
              max={customer.balance}
              step="0.01"
              className="w-full p-3 text-2xl text-center bg-dark-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
             <p className="text-right text-xs text-gray-500 mt-1">Dívida total: R$ {customer.balance.toFixed(2)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Método de Pagamento</label>
            <div className="grid grid-cols-3 gap-2">
                <Button variant={paymentMethod === 'Dinheiro' ? 'primary' : 'ghost'} onClick={() => setPaymentMethod('Dinheiro')}><Banknote className="mr-2" size={18}/>Dinheiro</Button>
                <Button variant={paymentMethod === 'Cartão' ? 'primary' : 'ghost'} onClick={() => setPaymentMethod('Cartão')}><CreditCard className="mr-2" size={18}/>Cartão</Button>
                <Button variant={paymentMethod === 'PIX' ? 'primary' : 'ghost'} onClick={() => setPaymentMethod('PIX')}><QrCode className="mr-2" size={18}/>PIX</Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="button" onClick={handleSave} disabled={isSaveDisabled}>Confirmar Pagamento</Button>
        </div>
      </div>
    </div>
  );
};

interface CustomerDetailsProps {
    customer: Customer;
    onDelete: (customerId: string) => void;
    onEdit: (customer: Customer) => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer, onDelete, onEdit }) => {
    const { sales, addCustomerPayment } = useData();
    const [settleCustomer, setSettleCustomer] = useState<Customer | null>(null);

    const customerSales = useMemo(() => sales
        .filter(sale => sale.customerId === customer.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [sales, customer.id]);

    const handleRemind = (e: React.MouseEvent, customer: Customer) => {
        e.stopPropagation();
        const message = `Olá ${customer.name}, passando para lembrar que sua conta no boteco está em R$ ${customer.balance.toFixed(2)}. Obrigado!`;
        const whatsappUrl = `https://wa.me/${customer.phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleSettleDebt = (customer: Customer, amount: number, paymentMethod: PaymentMethod) => {
        addCustomerPayment(customer.id, amount, paymentMethod);
        setSettleCustomer(null);
    };

    return (
        <Card className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-primary">{customer.name}</h3>
                    <p className="text-gray-400">{customer.phone}</p>
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(customer)}><Edit size={16} /></Button>
                    <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/20 hover:text-red-300" onClick={() => onDelete(customer.id)}><Trash2 size={16} /></Button>
                </div>
            </div>

            <p className="text-3xl font-light my-4">Dívida Total: <span className="font-bold text-red-400">R$ {customer.balance.toFixed(2)}</span></p>
            
            <div className="flex-grow flex flex-col border-t border-dark-700 pt-4">
                <h4 className="font-semibold mb-2">Extrato da Conta</h4>
                <div className="flex-1 overflow-y-auto pr-2 bg-dark-900/50 rounded-lg">
                    {customerSales.length > 0 ? (
                        <table className="w-full text-left text-sm">
                            <tbody>
                                {customerSales.map(sale => (
                                    <tr key={sale.id} className="border-b border-dark-700/50 last:border-b-0">
                                        <td className="p-2">{new Date(sale.createdAt).toLocaleDateString('pt-BR')}</td>
                                        <td className="p-2">{sale.items.map(i => i.name).join(', ')}</td>
                                        <td className="p-2 text-right">
                                            <span className={`font-semibold ${sale.paymentMethod === 'Fiado' ? 'text-red-400' : 'text-green-400'}`}>
                                                {sale.paymentMethod === 'Fiado' ? '-' : '+'} R$ {sale.total.toFixed(2)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <div className="flex items-center justify-center h-full text-gray-500">Nenhuma transação registrada.</div>
                    )}
                </div>
            </div>

            <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-dark-700">
                <Button onClick={() => setSettleCustomer(customer)} disabled={customer.balance <= 0} size="lg">Receber Pagamento</Button>
                <Button variant="secondary" onClick={(e) => handleRemind(e, customer)} disabled={customer.balance <= 0}><MessageSquare className="mr-2" size={18}/> Lembrar no WhatsApp</Button>
            </div>
            {settleCustomer && <SettleDebtModal customer={settleCustomer} onSave={handleSettleDebt} onClose={() => setSettleCustomer(null)} />}
        </Card>
    );
};

const Customers: React.FC = () => {
    const { customers, addCustomer, updateCustomer, deleteCustomer } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [customerToDeleteId, setCustomerToDeleteId] = useState<string | null>(null);


    const filteredCustomers = useMemo(() => 
        customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => b.balance - a.balance), 
    [customers, searchTerm]);
    
    const selectedCustomer = useMemo(() => 
        customers.find(c => c.id === selectedCustomerId), 
    [customers, selectedCustomerId]);

    const handleOpenModal = (customer: Customer | null) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'balance'> | Customer) => {
        if ('id' in customerData) {
            updateCustomer(customerData);
        } else {
            addCustomer(customerData);
        }
        setIsModalOpen(false);
        setEditingCustomer(null);
    };

    const handleDeleteRequest = (customerId: string) => {
      setCustomerToDeleteId(customerId);
      setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = () => {
      if (customerToDeleteId) {
        deleteCustomer(customerToDeleteId);
        if (selectedCustomerId === customerToDeleteId) {
          setSelectedCustomerId(null);
        }
      }
      setIsConfirmModalOpen(false);
      setCustomerToDeleteId(null);
    };

    const handleCancelDelete = () => {
      setIsConfirmModalOpen(false);
      setCustomerToDeleteId(null);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Clientes (Fiado)</h2>
                <Button onClick={() => handleOpenModal(null)}><Plus className="mr-2" size={18}/> Novo Cliente</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow min-h-0">
                {/* Left Column: Customer List */}
                <div className="md:col-span-1 flex flex-col bg-dark-800 p-4 rounded-xl">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            className="w-full p-2 pl-10 bg-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex-grow overflow-y-auto pr-2">
                        <div className="space-y-2">
                            {filteredCustomers.map(customer => (
                                <div
                                    key={customer.id}
                                    onClick={() => setSelectedCustomerId(customer.id)}
                                    className={`p-3 rounded-lg cursor-pointer transition-all ${selectedCustomerId === customer.id ? 'bg-primary text-dark-900' : 'bg-dark-700 hover:bg-dark-600'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">{customer.name}</span>
                                        {customer.balance > 0 && <span className="font-bold text-sm text-red-400">{selectedCustomerId === customer.id ? '' : `R$ ${customer.balance.toFixed(2)}`}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="md:col-span-2">
                    {selectedCustomer ? (
                        <CustomerDetails 
                            customer={selectedCustomer} 
                            onDelete={handleDeleteRequest}
                            onEdit={() => handleOpenModal(selectedCustomer)}
                        />
                    ) : (
                        <Card className="h-full flex items-center justify-center text-center">
                            <div>
                                <User className="mx-auto h-12 w-12 text-gray-500" />
                                <h3 className="mt-2 text-lg font-medium text-gray-400">Selecione um cliente</h3>
                                <p className="mt-1 text-sm text-gray-500">Clique em um cliente na lista para ver seu extrato.</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {isModalOpen && <CustomerModal customer={editingCustomer} onSave={handleSaveCustomer} onClose={() => setIsModalOpen(false)} />}
            {isConfirmModalOpen && (
              <ConfirmationModal
                title="Excluir Cliente"
                message="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Excluir"
              />
            )}
        </div>
    );
};

export default Customers;