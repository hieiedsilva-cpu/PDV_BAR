
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import type { Product } from '../types';
import Button from '../components/ui/Button';
import { Plus, Edit, Trash2, PackagePlus, Search } from 'lucide-react';
import AdjustStockModal from '../components/AdjustStockModal';


// --- Product Modal ---
interface ProductModalProps {
  product: Product | null;
  onSave: (productData: Omit<Product, 'id'> | Product) => void;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        category: product?.category || 'Cervejas (Garrafa)',
        price: product?.price || 0,
        costPrice: product?.costPrice || 0,
        stock: product?.stock || 0,
        minStock: product?.minStock || 0,
        ncm: product?.ncm || '',
        cfop: product?.cfop || '',
        cest: product?.cest || '',
        origem: product?.origem || '0',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numValue = ['price', 'costPrice', 'stock', 'minStock'].includes(name) ? parseFloat(value) : value;
        setFormData(prev => ({ ...prev, [name]: numValue }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (product) {
            onSave({ ...product, ...formData });
        } else {
            onSave(formData);
        }
    }
    
    const { products } = useData();
    const categories = useMemo(() => [...Array.from(new Set(products.map(p => p.category)))], [products]);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-dark-800 p-8 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-bold mb-6">{product ? 'Editar Produto' : 'Adicionar Produto'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Campo Nome do Produto */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome do Produto</label>
                        <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nome do Produto" required className="w-full p-2 bg-dark-700 rounded"/>
                    </div>

                    {/* Campo Categoria */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Categoria</label>
                        <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full p-2 bg-dark-700 rounded">
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    {/* Campos de Preço */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="costPrice" className="block text-sm font-medium text-gray-300 mb-1">Preço de Custo</label>
                            <input id="costPrice" type="number" name="costPrice" value={formData.costPrice} onChange={handleChange} placeholder="R$ 0,00" min="0" step="0.01" required className="w-full p-2 bg-dark-700 rounded"/>
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Preço de Venda</label>
                            <input id="price" type="number" name="price" value={formData.price} onChange={handleChange} placeholder="R$ 0,00" min="0" step="0.01" required className="w-full p-2 bg-dark-700 rounded"/>
                        </div>
                    </div>

                    {/* Campos de Estoque */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-300 mb-1">Estoque Atual</label>
                            <input id="stock" type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Unidades" min="0" required className="w-full p-2 bg-dark-700 rounded"/>
                        </div>
                        <div>
                            <label htmlFor="minStock" className="block text-sm font-medium text-gray-300 mb-1">Estoque Mínimo</label>
                            <input id="minStock" type="number" name="minStock" value={formData.minStock} onChange={handleChange} placeholder="Unidades" min="0" required className="w-full p-2 bg-dark-700 rounded"/>
                        </div>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t border-dark-700">
                        <h4 className="text-md font-semibold mb-2 text-gray-400">Dados Fiscais</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="ncm" className="block text-sm font-medium text-gray-300 mb-1">NCM</label>
                                <input id="ncm" type="text" name="ncm" value={formData.ncm} onChange={handleChange} placeholder="Ex: 22030000" required className="w-full p-2 bg-dark-700 rounded"/>
                            </div>
                            <div>
                                <label htmlFor="cfop" className="block text-sm font-medium text-gray-300 mb-1">CFOP</label>
                                <input id="cfop" type="text" name="cfop" value={formData.cfop} onChange={handleChange} placeholder="Ex: 5102" required className="w-full p-2 bg-dark-700 rounded"/>
                            </div>
                            <div>
                                <label htmlFor="cest" className="block text-sm font-medium text-gray-300 mb-1">CEST (Opcional)</label>
                                <input id="cest" type="text" name="cest" value={formData.cest} onChange={handleChange} placeholder="Ex: 0302100" className="w-full p-2 bg-dark-700 rounded"/>
                            </div>
                            <div>
                                <label htmlFor="origem" className="block text-sm font-medium text-gray-300 mb-1">Origem</label>
                                <input id="origem" type="text" name="origem" value={formData.origem} onChange={handleChange} placeholder="Ex: 0" required className="w-full p-2 bg-dark-700 rounded"/>
                            </div>
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// --- Inventory Page ---
const Inventory: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Low', 'Ok'

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(p => categoryFilter === 'All' || p.category === categoryFilter)
      .filter(p => {
        if (statusFilter === 'Low') return p.stock <= p.minStock;
        if (statusFilter === 'Ok') return p.stock > p.minStock;
        return true;
      });
  }, [products, searchTerm, categoryFilter, statusFilter]);
  
  const totalStockValue = useMemo(() => 
    filteredProducts.reduce((sum, p) => sum + (p.stock * p.costPrice), 0),
  [filteredProducts]);

  const openAddModal = () => {
    setSelectedProduct(null);
    setIsEditModalOpen(true);
  };
  
  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };
  
  const openAdjustModal = (product: Product) => {
    setSelectedProduct(product);
    setIsAdjustModalOpen(true);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setIsAdjustModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSave = (productData: Omit<Product, 'id'> | Product) => {
    if ('id' in productData) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }
    closeModal();
  };
  
  const handleDelete = (productId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto? A ação não pode ser desfeita.")) {
      deleteProduct(productId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciamento de Estoque</h2>
        <Button onClick={openAddModal}><Plus className="mr-2" size={18}/> Adicionar Produto</Button>
      </div>

      <div className="bg-dark-800 p-4 rounded-lg flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
          <input
            type="text"
            placeholder="Buscar produto por nome..."
            className="w-full p-2 pl-10 bg-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="p-2 bg-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'Todas as Categorias' : cat}</option>)}
        </select>
        <div className="flex items-center gap-2 bg-dark-700 p-1 rounded-lg">
            <Button size="sm" variant={statusFilter === 'All' ? 'primary' : 'ghost'} onClick={() => setStatusFilter('All')}>Todos</Button>
            <Button size="sm" variant={statusFilter === 'Low' ? 'primary' : 'ghost'} onClick={() => setStatusFilter('Low')}>Estoque Baixo</Button>
            <Button size="sm" variant={statusFilter === 'Ok' ? 'primary' : 'ghost'} onClick={() => setStatusFilter('Ok')}>Estoque OK</Button>
        </div>
      </div>

      <div className="bg-dark-800 rounded-lg overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead className="bg-dark-700">
            <tr>
              <th className="p-4">Produto</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">NCM</th>
              <th className="p-4 text-right">Preço Venda</th>
              <th className="p-4 text-center">Estoque Mín.</th>
              <th className="p-4 text-center">Estoque Atual</th>
              <th className="p-4 text-right">Valor em Estoque</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className="border-b border-dark-700 last:border-b-0 hover:bg-dark-700/50">
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4 text-gray-400">{product.category}</td>
                <td className="p-4 text-gray-400">{product.ncm}</td>
                <td className="p-4 text-right">R$ {product.price.toFixed(2)}</td>
                <td className="p-4 text-gray-400 text-center">{product.minStock}</td>
                <td className={`p-4 font-bold text-center ${product.stock <= product.minStock ? 'bg-red-500/20 text-red-300' : ''}`}>
                  {product.stock}
                </td>
                <td className="p-4 font-semibold text-right">R$ {(product.stock * product.costPrice).toFixed(2)}</td>
                <td className="p-4">
                    <div className="flex justify-center items-center gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openAdjustModal(product)} title="Ajustar Estoque"><PackagePlus size={18}/></Button>
                        <Button size="icon" variant="ghost" onClick={() => openEditModal(product)} title="Editar Produto"><Edit size={18}/></Button>
                        <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => handleDelete(product.id)} title="Excluir Produto"><Trash2 size={18}/></Button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-dark-700">
                <td colSpan={6} className="p-4 text-right font-bold text-gray-300">VALOR TOTAL EM ESTOQUE</td>
                <td className="p-4 font-bold text-lg text-primary text-right">R$ {totalStockValue.toFixed(2)}</td>
                <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      {isEditModalOpen && <ProductModal product={selectedProduct} onSave={handleSave} onClose={closeModal} />}
      {isAdjustModalOpen && selectedProduct && <AdjustStockModal product={selectedProduct} onSave={updateProduct} onClose={closeModal} />}
    </div>
  );
};

export default Inventory;