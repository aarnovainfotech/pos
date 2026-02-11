import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminSidebar() {
  const { user, logout } = useAuth();

  if (!user || user.role !== 'admin') return null;

  const links = [
    { path: '/admin', label: '📊 Dashboard' },
    { path: '/admin/products', label: '📦 Products' },
    { path: '/admin/categories', label: '📦 Categories' },
    { path: '/admin/attributes', label: '📦 Attributes' },
    { path: '/admin/variants', label: '🎨 Variants' },
    { path: '/admin/stock', label: '📉 Stock' },
    // { path: '/admin/purchases', label: '🧾 Purchase' },
    { path: '/admin/low-stock', label: '🧾 LOW Stock' },
    { path: '/admin/appSettings', label: '🎨 App Settings' },
    { path: '/admin/users', label: '👥 Cashiers' }
  ];

  return (
    <aside style={styles.sidebar}>
      <h3>SMART POS</h3>

      <div style={{ marginBottom: 10 }}>
        👋 {user.name}
      </div>

      <ul style={styles.ul}>
        {links.map(link => (
          <li key={link.path} style={styles.li}>
            <Link to={link.path} style={styles.link}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <button onClick={logout} style={styles.logout}>
        🚪 Logout
      </button>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 220,
    height: '100vh',
    background: '#111',
    color: '#fff',
    padding: 15
  },
  ul: {
    listStyle: 'none',
    padding: 0
  },
  li: {
    marginBottom: 10
  },
  link: {
    color: '#fff',
    textDecoration: 'none'
  },
  logout: {
    marginTop: 20,
    width: '100%'
  }
};
