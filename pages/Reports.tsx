import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { FileText, Sheet } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';


const Reports: React.FC = () => {
  const { sales, products } = useData();

  // 1. Produtos mais vendidos
  const topProductsData = useMemo(() => {
    const productSales = sales
      .flatMap(sale => sale.items)
      .reduce((acc, item) => {
        if(item.productId === 'payment') return acc;
        acc[item.name] = (acc[item.name] || 0) + item.quantity;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, Quantidade: quantity }));
  }, [sales]);
    
  // 2. Vendas por dia da semana
  const salesByWeekdayData = useMemo(() => {
    const salesByWeekday = sales.reduce((acc, sale) => {
        const day = new Date(sale.createdAt).toLocaleDateString('pt-BR', { weekday: 'long' });
        acc[day] = (acc[day] || 0) + sale.total;
        return acc;
    }, {} as Record<string, number>);

    const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return weekdays.map(day => ({
        name: day,
        Vendas: salesByWeekday[day] || 0
    }));
  }, [sales]);

  // 3. Vendas por Categoria de Produto
  const categoryData = useMemo(() => {
    const salesByCategory = sales.flatMap(s => s.items).reduce((acc, item) => {
      const product = products.find(p => p.id === item.productId);
      if(product) {
        const category = product.category;
        acc[category] = (acc[category] || 0) + (item.quantity * item.unitPrice);
      }
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(salesByCategory).map(([name, value]) => ({name, value}));
  }, [sales, products]);
  
  const COLORS = ['#f59e0b', '#06b6d4', '#10b981', '#ef4444', '#8b5cf6'];

  // 4. Análise de Horário de Pico
  const salesByHourData = useMemo(() => {
    const hourlySales = Array(24).fill(0).map((_, i) => ({
      name: `${String(i).padStart(2, '0')}:00`,
      Vendas: 0,
    }));
    sales.forEach(sale => {
      const hour = new Date(sale.createdAt).getHours();
      hourlySales[hour].Vendas += sale.total;
    });
    return hourlySales;
  }, [sales]);


  const handlePdfExport = () => {
    const doc = new jsPDF();
    const primaryColor: [number, number, number] = [245, 158, 11];

    doc.setFontSize(18);
    doc.text('Relatório de Vendas - Bar do Wood', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 29);

    autoTable(doc, {
        startY: 40,
        head: [['Top 5 Produtos Mais Vendidos']],
        body: topProductsData.map(p => [p.name, p.Quantidade]),
        columns: [{ header: 'Produto' }, { header: 'Quantidade' }],
        headStyles: { fillColor: primaryColor }
    });
    
    autoTable(doc, {
        head: [['Vendas por Categoria']],
        body: categoryData.map(c => [c.name, `R$ ${c.value.toFixed(2)}`]),
        columns: [{ header: 'Categoria' }, { header: 'Valor' }],
        headStyles: { fillColor: primaryColor }
    });

     autoTable(doc, {
        head: [['Vendas por Dia da Semana']],
        body: salesByWeekdayData.map(d => [d.name, `R$ ${d.Vendas.toFixed(2)}`]),
        columns: [{ header: 'Dia da Semana' }, { header: 'Vendas' }],
        headStyles: { fillColor: primaryColor }
    });

    autoTable(doc, {
        head: [['Vendas por Hora (Horário de Pico)']],
        body: salesByHourData.filter(h => h.Vendas > 0).map(d => [d.name, `R$ ${d.Vendas.toFixed(2)}`]),
        columns: [{ header: 'Hora' }, { header: 'Vendas' }],
        headStyles: { fillColor: primaryColor }
    });

    doc.save(`relatorio_bar_do_wood_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  const handleXlsxExport = () => {
    const wb = XLSX.utils.book_new();

    const wsTopProducts = XLSX.utils.json_to_sheet(topProductsData);
    XLSX.utils.book_append_sheet(wb, wsTopProducts, 'Top Produtos');
    
    const wsCategory = XLSX.utils.json_to_sheet(categoryData.map(c => ({ Categoria: c.name, Valor: c.value })));
    XLSX.utils.book_append_sheet(wb, wsCategory, 'Vendas por Categoria');
    
    const wsWeekday = XLSX.utils.json_to_sheet(salesByWeekdayData.map(d => ({ 'Dia da Semana': d.name, Vendas: d.Vendas })));
    XLSX.utils.book_append_sheet(wb, wsWeekday, 'Vendas por Dia');

    const wsHour = XLSX.utils.json_to_sheet(salesByHourData.map(d => ({ 'Hora': d.name, Vendas: d.Vendas })));
    XLSX.utils.book_append_sheet(wb, wsHour, 'Vendas por Hora');

    XLSX.writeFile(wb, `relatorio_bar_do_wood_${new Date().toISOString().split('T')[0]}.xlsx`);
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Relatórios e Insights</h2>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handlePdfExport}><FileText size={18} className="mr-2"/> Exportar PDF</Button>
          <Button variant="ghost" onClick={handleXlsxExport}><Sheet size={18} className="mr-2"/> Exportar Excel</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Top 5 Produtos Mais Vendidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis type="category" dataKey="name" width={120} stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} cursor={{fill: '#374151'}} />
              <Legend />
              <Bar dataKey="Quantidade" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4">Vendas por Categoria</h3>
           <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Vendas por Dia da Semana</h3>
             <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesByWeekdayData.map(d => ({...d, name: d.name.substring(0,3)}))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis tickFormatter={(tick) => `R$ ${tick}`} stroke="#9ca3af" />
                    <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} cursor={{fill: '#374151'}}/>
                    <Legend />
                    <Bar dataKey="Vendas" fill="#06b6d4" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
         <Card className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Análise de Horário de Pico</h3>
             <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesByHourData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(tick) => `R$ ${tick}`} stroke="#9ca3af" />
                    <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} cursor={{fill: '#374151'}}/>
                    <Legend />
                    <Bar dataKey="Vendas" fill="#10b981" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Reports;