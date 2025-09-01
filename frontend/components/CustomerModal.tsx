import React, { useState } from 'react';
import type { Customer } from '../types';
import Button from './ui/Button';

interface CustomerModalProps {
  customer: Customer | null;
  onSave: (customerData: Omit<Customer, 'id' | 'balance'> | Customer) => void;
  onClose: () => void;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ customer, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: customer?.name || '',
        phone: customer?.phone || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customer) {
            onSave({ ...customer, ...formData });
        } else {
            onSave(formData);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-dark-800 p-8 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-bold mb-6">{customer ? 'Editar Cliente' : 'Adicionar Cliente'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                        <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nome do Cliente" required className="w-full p-2 bg-dark-700 rounded"/>
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Telefone</label>
                        <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefone (ex: 55119...)" required className="w-full p-2 bg-dark-700 rounded"/>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CustomerModal;
