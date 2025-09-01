
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { DollarSign, Package, AlertTriangle, TrendingUp, ShoppingCart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { Product } from '../types';
import AdjustStockModal from '../components/AdjustStockModal';

const Dashboard: React.FC = () => {
  const { sales, products, expenses, updateProduct } = useData();
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleOpenRestockModal = (product: Product) => {
    setSelectedProduct(product);
    setIsRestockModalOpen(true);
  };

  const handleCloseRestockModal = () => {
    setSelectedProduct(null);
    setIsRestockModalOpen(false);
  };

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  const salesToday = sales.filter(s => s.createdAt.startsWith(todayString));
  const totalRevenueToday = salesToday.reduce((sum, sale) => sum + sale.total, 0);

  const salesYesterday = sales.filter(s => s.createdAt.startsWith(yesterdayString));
  const totalRevenueYesterday = salesYesterday.reduce((sum, sale) => sum + sale.total, 0);

  const percentageChange = totalRevenueYesterday > 0 
    ? ((totalRevenueToday - totalRevenueYesterday) / totalRevenueYesterday) * 100 
    : totalRevenueToday > 0 ? 100 : 0;
  
  const totalExpensesToday = expenses.filter(e => e.date.startsWith(todayString)).reduce((sum, exp) => sum + exp.amount, 0);

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  const salesByDate = sales.reduce((acc, sale) => {
    const date = new Date(sale.createdAt).toLocaleDateString('pt-BR');
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += sale.total;
    return acc;
  }, {} as Record<string, number>);
  
  const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('pt-BR');
  }).reverse();

  const chartData = last7Days.map(date => ({
      name: date,
      Vendas: salesByDate[date] || 0,
  }));
  
  const todayLocaleString = new Date().toLocaleDateString('pt-BR');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-500/20 rounded-full">
              <DollarSign className="w-6 h-6 text-gray-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Receita de Hoje</p>
              <p className="text-2xl font-bold">R$ {totalRevenueToday.toFixed(2)}</p>
              <p className={`text-xs font-semibold ${percentageChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(1)}% vs. ontem
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-red-500/20 rounded-full">
              <TrendingUp className="w-6 h-6 text-gray-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Despesas de Hoje</p>
              <p className="text-2xl font-bold">R$ {totalExpensesToday.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-500/20 rounded-full">
              <ShoppingCart className="w-6 h-6 text-gray-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Pedidos de Hoje</p>
              <p className="text-2xl font-bold">{salesToday.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500/20 rounded-full">
              <AlertTriangle className="w-6 h-6 text-gray-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-400">Estoque Baixo</p>
              <p className="text-2xl font-bold">{lowStockProducts.length} itens</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <h3 className="text-lg font-semibold mb-4">Vendas na Última Semana</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#9ca3af" tickFormatter={(value) => `R$${value}`} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} cursor={{fill: '#374151'}} formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                    <Bar dataKey="Vendas">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === todayLocaleString ? '#f59e0b' : '#06b6d4'} />
                      ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Card>
        <Card>
            <h3 className="text-lg font-semibold mb-4">Alerta de Estoque Baixo</h3>
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-2">
                {lowStockProducts.length > 0 ? lowStockProducts.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 bg-dark-700 rounded-md">
                        <div>
                          <span className="font-medium">{p.name}</span>
                          <p className="text-xs text-red-400 font-bold">Restam: {p.stock} Unid.</p>
                        </div>
                        <Button size="sm" variant="secondary" onClick={() => handleOpenRestockModal(p)}>
                          Repor
                        </Button>
                    </div>
                )) : <p className="text-gray-400 text-center pt-8">Nenhum item com estoque baixo. Tudo certo!</p>}
            </div>
        </Card>
      </div>
       {isRestockModalOpen && selectedProduct && (
        <AdjustStockModal 
          product={selectedProduct}
          onSave={(product) => {
            updateProduct(product);
            handleCloseRestockModal();
          }}
          onClose={handleCloseRestockModal}
        />
      )}
    </div>
  );
};

export default Dashboard;