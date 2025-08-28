import type { Product, Customer, Sale, Expense, Table } from './types';

export const initialProducts: Product[] = [
  // Cervejas (Garrafa 600ml)
  { id: 'p1', name: 'Cerveja Skol 600ml', price: 12.00, costPrice: 6.50, stock: 48, minStock: 12, category: 'Cervejas (Garrafa)', ncm: '22030000', cfop: '5405', origem: '0' },
  { id: 'p2', name: 'Cerveja Brahma Duplo Malte 600ml', price: 12.50, costPrice: 7.00, stock: 48, minStock: 12, category: 'Cervejas (Garrafa)', ncm: '22030000', cfop: '5405', origem: '0' },
  { id: 'p3', name: 'Cerveja Antarctica Original 600ml', price: 13.00, costPrice: 7.50, stock: 36, minStock: 12, category: 'Cervejas (Garrafa)', ncm: '22030000', cfop: '5405', origem: '0' },
  { id: 'p4', name: 'Cerveja Bohemia 600ml', price: 13.00, costPrice: 7.50, stock: 24, minStock: 12, category: 'Cervejas (Garrafa)', ncm: '22030000', cfop: '5405', origem: '0' },
  { id: 'p5', name: 'Cerveja Serramalte 600ml', price: 14.00, costPrice: 8.00, stock: 24, minStock: 12, category: 'Cervejas (Garrafa)', ncm: '22030000', cfop: '5405', origem: '0' },
  { id: 'p6', name: 'Cerveja Heineken 600ml', price: 16.00, costPrice: 9.50, stock: 60, minStock: 24, category: 'Cervejas (Garrafa)', ncm: '22030000', cfop: '5405', origem: '0' },
  { id: 'p7', name: 'Cerveja Stella Artois 600ml', price: 16.00, costPrice: 9.50, stock: 36, minStock: 12, category: 'Cervejas (Garrafa)', ncm: '22030000', cfop: '5405', origem: '0' },
  { id: 'p8', name: 'Cerveja Budweiser 600ml', price: 15.00, costPrice: 9.00, stock: 36, minStock: 12, category: 'Cervejas (Garrafa)', ncm: '22030000', cfop: '5405', origem: '0' },

  // Cervejas (Long Neck / Lata)
  { id: 'p9', name: 'Cerveja Heineken Long Neck', price: 9.00, costPrice: 5.00, stock: 72, minStock: 24, category: 'Cervejas (Long Neck / Lata)', ncm: '22030000', cfop: '5405', origem: '0' },
  { id: 'p10', name: 'Cerveja Stella Artois Long Neck', price: 9.00, costPrice: 5.00, stock: 48, minStock: 12, category: 'Cervejas (Long Neck / Lata)', ncm: '22030000', cfop: '5405', origem: '0' },
  { id: 'p11', name: 'Cerveja Budweiser Long Neck', price: 8.50, costPrice: 4.80, stock: 48, minStock: 12, category: 'Cervejas (Long Neck / Lata)', ncm: '22030000', cfop: '5405', origem: '0' },
  { id: 'p12', name: 'Cerveja Corona Long Neck', price: 10.00, costPrice: 5.50, stock: 48, minStock: 12, category: 'Cervejas (Long Neck / Lata)', ncm: '22030000', cfop: '5405', origem: '0' },
  { id: 'p13', name: 'Cerveja Skol Lata 350ml', price: 5.00, costPrice: 2.80, stock: 96, minStock: 24, category: 'Cervejas (Long Neck / Lata)', ncm: '22030000', cfop: '5405', origem: '0' },
  { id: 'p14', name: 'Cerveja Brahma Duplo Malte Lata 350ml', price: 5.50, costPrice: 3.00, stock: 72, minStock: 24, category: 'Cervejas (Long Neck / Lata)', ncm: '22030000', cfop: '5405', origem: '0' },
  { id: 'p15', name: 'Cerveja Itaipava Lata 350ml', price: 4.50, costPrice: 2.50, stock: 96, minStock: 24, category: 'Cervejas (Long Neck / Lata)', ncm: '22030000', cfop: '5405', origem: '0' },

  // Porções e Tira-Gostos
  { id: 'p16', name: 'Batata Frita', price: 25.00, costPrice: 11.00, stock: 100, minStock: 10, category: 'Porções', ncm: '20041000', cfop: '5102', origem: '0' },
  { id: 'p17', name: 'Batata Frita com Queijo e Bacon', price: 32.00, costPrice: 15.00, stock: 100, minStock: 10, category: 'Porções', ncm: '20041000', cfop: '5102', origem: '0' },
  { id: 'p18', name: 'Mandioca Frita (Aipim Frito)', price: 22.00, costPrice: 10.00, stock: 100, minStock: 10, category: 'Porções', ncm: '20049000', cfop: '5102', origem: '0' },
  { id: 'p19', name: 'Polenta Frita', price: 20.00, costPrice: 9.00, stock: 100, minStock: 10, category: 'Porções', ncm: '19023000', cfop: '5102', origem: '0' },
  { id: 'p20', name: 'Anéis de Cebola (Onion Rings)', price: 24.00, costPrice: 11.00, stock: 100, minStock: 10, category: 'Porções', ncm: '20059900', cfop: '5102', origem: '0' },
  { id: 'p21', name: 'Calabresa Acebolada', price: 30.00, costPrice: 14.00, stock: 100, minStock: 15, category: 'Porções', ncm: '16010000', cfop: '5102', origem: '0' },
  { id: 'p22', name: 'Frango a Passarinho', price: 35.00, costPrice: 17.00, stock: 100, minStock: 15, category: 'Porções', ncm: '16023220', cfop: '5102', origem: '0' },
  { id: 'p23', name: 'Isca de Frango à Milanesa', price: 33.00, costPrice: 16.00, stock: 100, minStock: 10, category: 'Porções', ncm: '16023220', cfop: '5102', origem: '0' },
  { id: 'p24', name: 'Isca de Peixe (Tilápia)', price: 38.00, costPrice: 18.00, stock: 100, minStock: 10, category: 'Porções', ncm: '16041900', cfop: '5102', origem: '0' },
  { id: 'p25', name: 'Torresmo', price: 28.00, costPrice: 13.00, stock: 100, minStock: 10, category: 'Porções', ncm: '02101900', cfop: '5102', origem: '0' },
  { id: 'p26', name: 'Tábua de Frios (Salame, Queijo, Azeitona)', price: 45.00, costPrice: 22.00, stock: 100, minStock: 8, category: 'Porções', ncm: '16010000', cfop: '5102', origem: '0' },
  { id: 'p27', name: 'Provolone à Milanesa', price: 30.00, costPrice: 14.00, stock: 100, minStock: 10, category: 'Porções', ncm: '04061090', cfop: '5102', origem: '0' },
  { id: 'p28', name: 'Ovo de Codorna', price: 15.00, costPrice: 7.00, stock: 50, minStock: 10, category: 'Porções', ncm: '04079000', cfop: '5102', origem: '0' },
  { id: 'p29', name: 'Azeitonas Verdes Temperadas', price: 12.00, costPrice: 6.00, stock: 50, minStock: 10, category: 'Porções', ncm: '20057000', cfop: '5102', origem: '0' },
  { id: 'p30', name: 'Amendoim Torrado', price: 8.00, costPrice: 3.50, stock: 80, minStock: 20, category: 'Porções', ncm: '20081100', cfop: '5102', origem: '0' },

  // Lanches e Salgados
  { id: 'p31', name: 'Pastel de Carne', price: 8.00, costPrice: 3.50, stock: 60, minStock: 20, category: 'Salgados', ncm: '19022000', cfop: '5102', origem: '0' },
  { id: 'p32', name: 'Pastel de Queijo', price: 8.00, costPrice: 3.50, stock: 60, minStock: 20, category: 'Salgados', ncm: '19022000', cfop: '5102', origem: '0' },
  { id: 'p33', name: 'Pastel de Pizza', price: 8.00, costPrice: 3.50, stock: 50, minStock: 15, category: 'Salgados', ncm: '19022000', cfop: '5102', origem: '0' },
  { id: 'p34', name: 'Pastel de Palmito', price: 8.00, costPrice: 3.50, stock: 40, minStock: 15, category: 'Salgados', ncm: '19022000', cfop: '5102', origem: '0' },
  { id: 'p35', name: 'Coxinha de Frango', price: 7.00, costPrice: 3.00, stock: 100, minStock: 25, category: 'Salgados', ncm: '16023220', cfop: '5102', origem: '0' },
  { id: 'p36', name: 'Kibe', price: 7.00, costPrice: 3.00, stock: 100, minStock: 25, category: 'Salgados', ncm: '16025000', cfop: '5102', origem: '0' },
  { id: 'p37', name: 'Bolinho de Bacalhau', price: 9.00, costPrice: 4.00, stock: 80, minStock: 20, category: 'Salgados', ncm: '16041600', cfop: '5102', origem: '0' },
  { id: 'p38', name: 'Misto Quente', price: 10.00, costPrice: 4.50, stock: 100, minStock: 10, category: 'Salgados', ncm: '16010000', cfop: '5102', origem: '0' },
  { id: 'p39', name: 'X-Salada', price: 18.00, costPrice: 8.00, stock: 100, minStock: 10, category: 'Salgados', ncm: '16025000', cfop: '5102', origem: '0' },
  { id: 'p40', name: 'X-Bacon', price: 22.00, costPrice: 10.00, stock: 100, minStock: 10, category: 'Salgados', ncm: '16025000', cfop: '5102', origem: '0' },

  // Caipirinhas e Batidas
  { id: 'p41', name: 'Caipirinha de Cachaça (Limão)', price: 15.00, costPrice: 6.00, stock: 100, minStock: 10, category: 'Drinks', ncm: '22084000', cfop: '5102', origem: '0' },
  { id: 'p42', name: 'Caipirinha de Vodka (Limão)', price: 18.00, costPrice: 8.00, stock: 100, minStock: 10, category: 'Drinks', ncm: '22086000', cfop: '5102', origem: '0' },
  { id: 'p43', name: 'Caipirinha de Saquê (Limão)', price: 20.00, costPrice: 9.00, stock: 100, minStock: 10, category: 'Drinks', ncm: '22060090', cfop: '5102', origem: '0' },
  { id: 'p44', name: 'Caipiroska de Morango', price: 22.00, costPrice: 10.00, stock: 100, minStock: 10, category: 'Drinks', ncm: '22086000', cfop: '5102', origem: '0' },
  { id: 'p45', name: 'Caipiroska de Maracujá', price: 22.00, costPrice: 10.00, stock: 100, minStock: 10, category: 'Drinks', ncm: '22086000', cfop: '5102', origem: '0' },
  { id: 'p46', name: 'Batida de Coco', price: 14.00, costPrice: 6.00, stock: 100, minStock: 10, category: 'Drinks', ncm: '22084000', cfop: '5102', origem: '0' },
  { id: 'p47', name: 'Batida de Morango', price: 14.00, costPrice: 6.00, stock: 100, minStock: 10, category: 'Drinks', ncm: '22084000', cfop: '5102', origem: '0' },
  { id: 'p48', name: 'Batida de Amendoim', price: 14.00, costPrice: 6.00, stock: 100, minStock: 10, category: 'Drinks', ncm: '22084000', cfop: '5102', origem: '0' },

  // Doses e Destilados
  { id: 'p49', name: 'Dose de Cachaça 51', price: 5.00, costPrice: 1.50, stock: 100, minStock: 10, category: 'Doses', ncm: '22084000', cfop: '5102', origem: '0' },
  { id: 'p50', name: 'Dose de Cachaça Velho Barreiro', price: 6.00, costPrice: 2.00, stock: 100, minStock: 10, category: 'Doses', ncm: '22084000', cfop: '5102', origem: '0' },
  { id: 'p51', name: 'Dose de Cachaça Pitú', price: 5.00, costPrice: 1.50, stock: 100, minStock: 10, category: 'Doses', ncm: '22084000', cfop: '5102', origem: '0' },
  { id: 'p52', name: 'Dose de Vodka Smirnoff', price: 10.00, costPrice: 4.00, stock: 100, minStock: 10, category: 'Doses', ncm: '22086000', cfop: '5102', origem: '0' },
  { id: 'p53', name: 'Dose de Vodka Orloff', price: 9.00, costPrice: 3.50, stock: 100, minStock: 10, category: 'Doses', ncm: '22086000', cfop: '5102', origem: '0' },
  { id: 'p54', name: 'Dose de Whisky Red Label', price: 18.00, costPrice: 8.00, stock: 100, minStock: 5, category: 'Doses', ncm: '22083000', cfop: '5102', origem: '0' },
  { id: 'p55', name: 'Dose de Whisky Jack Daniel\'s', price: 22.00, costPrice: 10.00, stock: 100, minStock: 5, category: 'Doses', ncm: '22083000', cfop: '5102', origem: '0' },
  { id: 'p56', name: 'Dose de Gin Gordon\'s', price: 16.00, costPrice: 7.00, stock: 100, minStock: 5, category: 'Doses', ncm: '22085000', cfop: '5102', origem: '0' },
  { id: 'p57', name: 'Dose de Campari', price: 12.00, costPrice: 5.00, stock: 100, minStock: 10, category: 'Doses', ncm: '22089000', cfop: '5102', origem: '0' },
  { id: 'p58', name: 'Dose de Rum Montilla', price: 10.00, costPrice: 4.00, stock: 100, minStock: 10, category: 'Doses', ncm: '22084000', cfop: '5102', origem: '0' },
  { id: 'p59', name: 'Dose de Tequila José Cuervo', price: 15.00, costPrice: 6.50, stock: 100, minStock: 5, category: 'Doses', ncm: '22089000', cfop: '5102', origem: '0' },

  // Bebidas Não Alcoólicas
  { id: 'p60', name: 'Coca-Cola Lata', price: 6.00, costPrice: 3.00, stock: 120, minStock: 24, category: 'Bebidas Não Alcoólicas', ncm: '22021000', cfop: '5405', origem: '0' },
  { id: 'p61', name: 'Coca-Cola Zero Lata', price: 6.00, costPrice: 3.00, stock: 96, minStock: 24, category: 'Bebidas Não Alcoólicas', ncm: '22021000', cfop: '5405', origem: '0' },
  { id: 'p62', name: 'Guaraná Antarctica Lata', price: 5.50, costPrice: 2.80, stock: 120, minStock: 24, category: 'Bebidas Não Alcoólicas', ncm: '22021000', cfop: '5405', origem: '0' },
  { id: 'p63', name: 'Guaraná Antarctica Zero Lata', price: 5.50, costPrice: 2.80, stock: 72, minStock: 12, category: 'Bebidas Não Alcoólicas', ncm: '22021000', cfop: '5405', origem: '0' },
  { id: 'p64', name: 'Fanta Laranja Lata', price: 5.50, costPrice: 2.80, stock: 72, minStock: 24, category: 'Bebidas Não Alcoólicas', ncm: '22021000', cfop: '5405', origem: '0' },
  { id: 'p65', name: 'Soda Limonada Lata', price: 5.50, costPrice: 2.80, stock: 48, minStock: 12, category: 'Bebidas Não Alcoólicas', ncm: '22021000', cfop: '5405', origem: '0' },
  { id: 'p66', name: 'Água Mineral com Gás', price: 4.00, costPrice: 1.80, stock: 150, minStock: 30, category: 'Bebidas Não Alcoólicas', ncm: '22011000', cfop: '5405', origem: '0' },
  { id: 'p67', name: 'Água Mineral sem Gás', price: 4.00, costPrice: 1.80, stock: 150, minStock: 30, category: 'Bebidas Não Alcoólicas', ncm: '22011000', cfop: '5405', origem: '0' },
  { id: 'p68', name: 'Suco Natural de Laranja', price: 8.00, costPrice: 3.50, stock: 100, minStock: 10, category: 'Bebidas Não Alcoólicas', ncm: '20091200', cfop: '5102', origem: '0' },
  { id: 'p69', name: 'Suco Natural de Abacaxi', price: 8.00, costPrice: 3.50, stock: 100, minStock: 10, category: 'Bebidas Não Alcoólicas', ncm: '20094100', cfop: '5102', origem: '0' },
  { id: 'p70', name: 'Suco de Polpa - Morango', price: 7.00, costPrice: 3.00, stock: 100, minStock: 10, category: 'Bebidas Não Alcoólicas', ncm: '20098990', cfop: '5102', origem: '0' },
  { id: 'p71', name: 'Suco de Polpa - Maracujá', price: 7.00, costPrice: 3.00, stock: 100, minStock: 10, category: 'Bebidas Não Alcoólicas', ncm: '20098990', cfop: '5102', origem: '0' },
  { id: 'p72', name: 'H2OH! Limoneto', price: 6.50, costPrice: 3.20, stock: 48, minStock: 12, category: 'Bebidas Não Alcoólicas', ncm: '22021000', cfop: '5405', origem: '0' },
  { id: 'p73', name: 'Red Bull Energético', price: 12.00, costPrice: 6.00, stock: 48, minStock: 12, category: 'Bebidas Não Alcoólicas', ncm: '22029900', cfop: '5405', origem: '0' },

  // Sobremesas
  { id: 'p74', name: 'Açaí na Tigela (com banana e granola)', price: 18.00, costPrice: 8.00, stock: 100, minStock: 10, category: 'Sobremesas', ncm: '21069090', cfop: '5102', origem: '0' },
  { id: 'p75', name: 'Pudim de Leite Condensado', price: 10.00, costPrice: 4.00, stock: 100, minStock: 5, category: 'Sobremesas', ncm: '19019090', cfop: '5102', origem: '0' },
  { id: 'p76', name: 'Mousse de Maracujá', price: 9.00, costPrice: 3.50, stock: 100, minStock: 5, category: 'Sobremesas', ncm: '21069090', cfop: '5102', origem: '0' },
  { id: 'p77', name: 'Sorvete de Creme (bola)', price: 6.00, costPrice: 2.50, stock: 100, minStock: 10, category: 'Sobremesas', ncm: '21050010', cfop: '5102', origem: '0' },

  // Outros
  { id: 'p78', name: 'Café Expresso', price: 5.00, costPrice: 2.00, stock: 200, minStock: 20, category: 'Outros', ncm: '09012100', cfop: '5102', origem: '0' },
  { id: 'p79', name: 'Cigarro Marlboro (maço)', price: 12.00, costPrice: 8.00, stock: 30, minStock: 10, category: 'Outros', ncm: '24022000', cfop: '5405', origem: '0' },
  { id: 'p80', name: 'Cigarro Dunhill (maço)', price: 12.00, costPrice: 8.00, stock: 20, minStock: 5, category: 'Outros', ncm: '24022000', cfop: '5405', origem: '0' },
  { id: 'p81', name: 'Gelo (copo)', price: 1.00, costPrice: 0.10, stock: 1000, minStock: 100, category: 'Outros', ncm: '22019000', cfop: '5102', origem: '0' },
];


export const initialCustomers: Customer[] = [
  { id: '1', name: 'Seu Jorge', phone: '5511987654321', balance: 75.50 },
  { id: '2', name: 'Dona Maria', phone: '5511912345678', balance: 22.00 },
];

export const initialTables: Table[] = Array.from({ length: 12 }, (_, i) => ({
    id: `table-${i + 1}`,
    number: i + 1,
    status: 'Livre',
}));


const generateSales = (): Sale[] => {
    const sales: Sale[] = [];
    const today = new Date();

    // Today's Sales
    sales.push({
        id: 'sale-today-1',
        items: [{ productId: 'p1', name: 'Cerveja Skol 600ml', quantity: 2, unitPrice: 12.00 }, { productId: 'p16', name: 'Batata Frita', quantity: 1, unitPrice: 25.00 }],
        total: 49.00,
        paymentMethod: 'Dinheiro',
        createdAt: new Date(new Date().setHours(today.getHours() - 2)).toISOString(),
        tableNumber: 3,
        nfceEmitted: false,
    });
     sales.push({
        id: 'sale-today-2',
        items: [{ productId: 'p60', name: 'Coca-Cola Lata', quantity: 2, unitPrice: 6.00 }],
        total: 12.00,
        paymentMethod: 'PIX',
        createdAt: new Date(new Date().setHours(today.getHours() - 1)).toISOString(),
        tableNumber: 8,
        nfceEmitted: true,
        cpf: '123.456.789-00',
    });

    // Yesterday's Sales
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    sales.push({
        id: 'sale-yesterday-1',
        items: [{ productId: 'p2', name: 'Cerveja Brahma Duplo Malte 600ml', quantity: 4, unitPrice: 12.50 }],
        total: 50.00,
        paymentMethod: 'Fiado',
        customerId: '1',
        createdAt: yesterday.toISOString(),
        tableNumber: 1,
        nfceEmitted: false,
    });

    // Sales for the last week
    for (let i = 2; i <= 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        sales.push({
            id: `sale-past-${i}`,
            items: [
                { productId: 'p6', name: 'Cerveja Heineken 600ml', quantity: Math.floor(Math.random() * 4) + 1, unitPrice: 16.00 },
                { productId: 'p31', name: 'Pastel de Carne', quantity: Math.floor(Math.random() * 3) + 1, unitPrice: 8.00 }
            ],
            total: Math.random() * 50 + 20,
            paymentMethod: 'Cartão',
            createdAt: date.toISOString(),
            tableNumber: i,
            nfceEmitted: false,
        });
    }
    
    return sales;
};


export const initialSales: Sale[] = generateSales();


export const initialExpenses: Expense[] = [
    { id: '1', description: 'Compra de Gelo', amount: 30.00, date: new Date().toISOString(), category: 'Fornecedores' },
    { id: '2', description: 'Fornecedor de Cerveja', amount: 450.00, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), category: 'Fornecedores' },
    { id: '3', description: 'Aluguel', amount: 1200.00, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), category: 'Fixas' },
    { id: '4', description: 'Conta de Luz', amount: 250.00, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), category: 'Fixas' },
];
