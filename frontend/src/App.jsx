import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';

// layouts
import AdminLayout from './layouts/AdminLayout';
import CashierLayout from './layouts/CashierLayout';

// auth
import Login from './pages/auth/Login';

// admin pages
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Categories from './pages/admin/Categories';
import Attributes from './pages/admin/Attributes';
import Products from './pages/admin/Products';
import Variants from './pages/admin/Variants';
import Stock from './pages/admin/Stock';
import LowStock from './pages/admin/LowStock';
import AppSettings from './pages/admin/AppSettings';
import Purchases from './pages/admin/Purchases';

// cashier
import POS from './pages/cashier/POS';

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>

      {/* 🔐 LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* 👑 ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="categories" element={<Categories />} />
        <Route path="attributes" element={<Attributes />} />
        <Route path="products" element={<Products />} />
        <Route path="variants" element={<Variants />} />
        <Route path="stock" element={<Stock />} />
        <Route path="low-stock" element={<LowStock />} />
        <Route path="appSettings" element={<AppSettings />} />
        <Route path="purchases" element={<Purchases />} />
      </Route>

      {/* 🧾 CASHIER */}
      <Route
        path="/pos"
        element={
          <ProtectedRoute role="cashier">
            <CashierLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<POS />} />
      </Route>

      {/* 🌍 ROOT */}
      <Route
        path="/"
        element={
          user
            ? user.role === 'admin'
              ? <Navigate to="/admin/dashboard" />
              : <Navigate to="/pos" />
            : <Navigate to="/login" />
        }
      />

    </Routes>
  );
}
