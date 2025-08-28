import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import type { Expense, Sale } from '../types';
import { Plus, TrendingUp, TrendingDown, Wallet, FileSpreadsheet } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';


// --- Expense Modal ---
interface ExpenseModalProps {
  onSave: (expense: Omit<Expense, 'id'>) => void;
  onClose: () => void;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ onSave, onClose }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Fornecedores');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) return;
        onSave({ description, amount: amountNum, category, date: new Date().toISOString() });
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-dark-800 p-8 rounded-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-6">Adicionar Nova Despesa</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição (ex: Fornecedor, Gelo)" required className="w-full p-2 bg-dark-700 rounded"/>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 bg-dark-700 rounded">
                        <option>Fornecedores</option>
                        <option>Fixas</option>
                        <option>Aluguel</option>
                        <option>Salários</option>
                        <option>Outros</option>
                    </select>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Valor" min="0.01" step="0.01" required className="w-full p-2 bg-dark-700 rounded"/>
                    <div className="flex justify-end gap-4 mt-6">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">Salvar Despesa</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}


const Financial: React.FC = () => {
    const { sales, expenses, customers, addExpense } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [period, setPeriod] = useState<'today' | 'week' | 'month'>('month');

    const isDateInPeriod = (date: Date, period: 'today' | 'week' | 'month'): boolean => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        switch(period) {
            case 'today':
                return date >= today;
            case 'week':
                const firstDayOfWeek = new Date(today);
                firstDayOfWeek.setDate(today.getDate() - today.getDay());
                return date >= firstDayOfWeek;
            case 'month':
                const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                return date >= firstDayOfMonth;
        }
    };

    const filteredSales = useMemo(() => sales.filter(s => isDateInPeriod(new Date(s.createdAt), period)), [sales, period]);
    const filteredExpenses = useMemo(() => expenses.filter(e => isDateInPeriod(new Date(e.date), period)), [expenses, period]);

    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const accountsReceivable = customers.reduce((sum, customer) => sum + customer.balance, 0);
    const netProfit = totalRevenue - totalExpenses;

    const expensesByCategory = useMemo(() => {
        const categoryMap = filteredExpenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
    }, [filteredExpenses]);

    const COLORS = ['#f59e0b', '#06b6d4', '#10b981', '#ef4444', '#8b5cf6'];
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold">Painel Financeiro</h2>
                 <div className="flex items-center gap-2 bg-dark-800 p-1 rounded-lg">
                    <Button size="sm" variant={period === 'today' ? 'primary' : 'ghost'} onClick={() => setPeriod('today')}>Hoje</Button>
                    <Button size="sm" variant={period === 'week' ? 'primary' : 'ghost'} onClick={() => setPeriod('week')}>Esta Semana</Button>
                    <Button size="sm" variant={period === 'month' ? 'primary' : 'ghost'} onClick={() => setPeriod('month')}>Este Mês</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 bg-green-500/20 rounded-full"><TrendingUp className="w-6 h-6 text-green-400"/></div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-400">Faturamento Bruto</p>
                            <p className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 bg-red-500/20 rounded-full"><TrendingDown className="w-6 h-6 text-red-400"/></div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-400">Despesas Totais</p>
                            <p className="text-2xl font-bold">R$ {totalExpenses.toFixed(2)}</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-500/20 rounded-full"><Wallet className="w-6 h-6 text-blue-400"/></div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-400">Lucro Líquido</p>
                            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                R$ {netProfit.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-500/20 rounded-full"><FileSpreadsheet className="w-6 h-6 text-yellow-400"/></div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-400">Contas a Receber</p>
                            <p className="text-2xl font-bold">R$ {accountsReceivable.toFixed(2)}</p>
                        </div>
                    </div>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Despesas do Período</h3>
                        <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2" size={16}/> Nova Despesa</Button>
                    </div>
                    <div className="bg-dark-800 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className="bg-dark-700 sticky top-0">
                                <tr>
                                    <th className="p-4">Data</th>
                                    <th className="p-4">Descrição</th>
                                    <th className="p-4">Categoria</th>
                                    <th className="p-4">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExpenses.length > 0 ? filteredExpenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(expense => (
                                    <tr key={expense.id} className="border-b border-dark-700 last:border-b-0">
                                        <td className="p-4">{new Date(expense.date).toLocaleDateString('pt-BR')}</td>
                                        <td className="p-4">{expense.description}</td>
                                        <td className="p-4 text-gray-400">{expense.category}</td>
                                        <td className="p-4 text-red-400 font-semibold">R$ {expense.amount.toFixed(2)}</td>
                                    </tr>
                                )) : <tr><td colSpan={4} className="text-center p-8 text-gray-500">Nenhuma despesa no período.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
                 <div className="lg:col-span-2">
                     <h3 className="text-xl font-semibold mb-4">Despesas por Categoria</h3>
                     <Card>
                         {expensesByCategory.length > 0 ? (
                             <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                <Pie
                                    data={expensesByCategory}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={110}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {expensesByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} contentStyle={{ backgroundColor: '#1f2d37', border: 'none' }}/>
                                </PieChart>
                            </ResponsiveContainer>
                         ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-500">
                                Sem dados para exibir.
                            </div>
                         )}
                     </Card>
                </div>
            </div>
            
            {isModalOpen && <ExpenseModal onSave={(expense) => { addExpense(expense); setIsModalOpen(false); }} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}

export default Financial;
