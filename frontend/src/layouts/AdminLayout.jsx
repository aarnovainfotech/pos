import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />

      <div style={{ flex: 1, padding: 20 }}>
        <Outlet /> {/* 🔥 REQUIRED */}
      </div>
    </div>
  );
}
