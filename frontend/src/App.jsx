import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import BottomNav from './components/common/BottomNav';
import QuickAddModal from './components/transactions/QuickAddModal';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Categories from './pages/Categories';
import Reports from './pages/Reports';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import Accounts from './pages/Accounts';
import Trips from './pages/Trips';
import Bills from './pages/Bills';
import Debts from './pages/Debts';
import ImportExport from './pages/ImportExport';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Layout wrapper for authenticated pages
const AppLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100 dark:bg-[#1A0408]">
        <div className="w-10 h-10 border-4 border-burgundy-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-[#1A0408] text-burgundy-950 dark:text-cream-100 flex transition-colors duration-200">
      {/* Sidebar Navigation (Desktop & Mobile Drawer) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenQuickAdd={() => setQuickAddOpen(true)}
        />

        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-36 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation for Mobile / iPhones (Panel 12) */}
      <BottomNav onOpenQuickAdd={() => setQuickAddOpen(true)} />

      {/* Global Quick Add Modal */}
      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing Home Page */}
            <Route path="/" element={<Home />} />

            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected App Routes */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/bills" element={<Bills />} />
              <Route path="/debts" element={<Debts />} />
              <Route path="/import-export" element={<ImportExport />} />
            </Route>

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
