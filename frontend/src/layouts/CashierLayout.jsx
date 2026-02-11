import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CashierLayout() {
  const { user, logout } = useAuth();

  return (
    <div style={{ height: '100vh', background: '#111', color: '#fff' }}>
      <header style={{
        padding: 10,
        background: '#000',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <div>🧾 SmartPOS</div>
        <div>
          {user?.name}
          <button onClick={logout} style={{ marginLeft: 10 }}>
            Logout
          </button>
        </div>
      </header>

      <main style={{ padding: 10 }}>
        <Outlet />
      </main>
    </div>
  );
}
