
import React from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { Home, Beer, ClipboardList, Users, BarChart2, DollarSign } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Financial from './pages/Financial';
import Logo from './components/Logo';

const navItems = [
  { path: '/', name: 'Dashboard', icon: Home },
  { path: '/pos', name: 'Caixa (PDV)', icon: DollarSign },
  { path: '/inventory', name: 'Estoque', icon: Beer },
  { path: '/customers', name: 'Clientes (Fiado)', icon: Users },
  { path: '/financial', name: 'Financeiro', icon: ClipboardList },
  { path: '/reports', name: 'Relatórios', icon: BarChart2 },
];

const Sidebar: React.FC = () => (
  <aside className="w-64 bg-dark-800 p-4 flex flex-col">
    <div className="flex justify-center items-center py-4 mb-4">
        <div className="h-24 w-24">
            <Logo />
        </div>
    </div>
    <nav className="flex flex-col space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition-colors hover:bg-dark-700 ${
              isActive ? 'bg-primary text-dark-900' : ''
            }`
          }
        >
          <item.icon className="w-5 h-5 mr-3" />
          <span>{item.name}</span>
        </NavLink>
      ))}
    </nav>
  </aside>
);

const Header: React.FC = () => {
  const location = useLocation();
  const currentNavItem = navItems.find(item => item.path === location.pathname);
  const title = currentNavItem ? currentNavItem.name : 'Dashboard';

  return (
    <header className="bg-dark-800 p-4 shadow-md">
      <h2 className="text-xl font-semibold">{title}</h2>
    </header>
  );
};

export default function App() {
  return (
    <DataProvider>
      <HashRouter>
        <div className="flex h-screen bg-dark-900 text-gray-200">
          <Sidebar />
          <main className="flex-1 flex flex-col">
            <Header />
            <div className="flex-1 p-6 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pos" element={<POS />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/financial" element={<Financial />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </div>
          </main>
        </div>
      </HashRouter>
    </DataProvider>
  );
}