import React, { useState } from 'react';
import type { Product } from '../types';
import Button from './ui/Button';

// --- Adjust Stock Modal ---
interface AdjustStockModalProps {
  product: Product;
  onSave: (product: Product) => void;
  onClose: () => void;
}

const AdjustStockModal: React.FC<AdjustStockModalProps> = ({ product, onSave, onClose }) => {
  const [adjustment, setAdjustment] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const adjustmentValue = parseInt(adjustment, 10);
    if (isNaN(adjustmentValue)) return;
    
    const newStock = product.stock + adjustmentValue;
    if (newStock < 0) {
      alert("O estoque não pode ficar negativo.");
      return;
    }
    onSave({ ...product, stock: newStock });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <form className="bg-dark-800 p-8 rounded-lg w-full max-w-sm" onClick={e => e.stopPropagation()} onSubmit={handleSave}>
        <h3 className="text-xl font-bold mb-2">Ajustar Estoque</h3>
        <p className="text-primary font-semibold mb-6">{product.name}</p>
        <p className="mb-4">Estoque Atual: <span className="font-bold text-lg">{product.stock}</span></p>
        
        <div>
          <label htmlFor="adjustment" className="block text-sm font-medium text-gray-400 mb-1">
            Adicionar / Remover Quantidade
          </label>
          <input
            id="adjustment"
            type="number"
            value={adjustment}
            onChange={(e) => setAdjustment(e.target.value)}
            placeholder="Ex: 24 (adicionar) ou -10 (remover)"
            className="w-full p-3 text-lg text-center bg-dark-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
            required
          />
        </div>
        
        <div className="flex justify-end gap-4 mt-8">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Salvar Ajuste</Button>
        </div>
      </form>
    </div>
  );
};

export default AdjustStockModal;