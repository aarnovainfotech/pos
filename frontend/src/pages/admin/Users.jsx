import { useEffect, useMemo, useState } from 'react';
import { userService } from '../../services/userService';

const PAGE_SIZE = 5;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    username: '',
    password: ''
  });

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    load();
  }, []);

  /* =========================
     LOAD USERS (FIXED)
  ========================= */
  async function load() {
    try {
      setLoading(true);

      const res = await userService.getAll();

      // ✅ api already returns response.data
      const usersData = res?.data;

      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error('Failed to load users', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     CREATE CASHIER
  ========================= */
  async function createCashier(e) {
    e.preventDefault();

    if (!form.name || !form.username || !form.password) {
      return alert('All fields are required');
    }

    await userService.createCashier(form);
    setForm({ name: '', username: '', password: '' });
    load();
  }

  /* =========================
     DELETE USER
  ========================= */
  async function remove(id) {
    if (!confirm('Delete this user?')) return;
    await userService.remove(id);
    load();
  }

  /* =========================
     SEARCH + PAGINATION
  ========================= */
  const filtered = useMemo(() => {
    setPage(1);
    return users.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, users]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="page">
      <style>{css}</style>

      <div className="card">
        <div className="header">
          <h2>👤 User Management</h2>
          <p>Admin can create and manage cashier accounts</p>
        </div>

        {/* CREATE CASHIER */}
        <form className="form" onSubmit={createCashier}>
          <input
            placeholder="Full name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />

          <button className="btn primary">
            ➕ Add Cashier
          </button>
        </form>

        {/* SEARCH */}
        <input
          className="search"
          placeholder="🔍 Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* TABLE */}
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Role</th>
                <th width="100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="center">Loading...</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="4" className="center muted">
                    No users found
                  </td>
                </tr>
              ) : (
                paginated.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.username}</td>
                    <td>
                      <span className={`badge ${u.role}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      {u.role !== 'admin' && (
                        <button
                          className="icon danger"
                          onClick={() => remove(u.id)}
                        >
                          🗑
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              ◀ Prev
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   MODERN CSS (SINGLE FILE)
========================= */
const css = `
.page {
  background: #f5f7fb;
  padding: 32px;
  min-height: 100vh;
  font-family: system-ui, -apple-system, BlinkMacSystemFont;
}

.card {
  max-width: 960px;
  margin: auto;
  background: #ffffff;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
}

.header {
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  font-size: 24px;
}

.header p {
  color: #6b7280;
  margin-top: 4px;
}

.form {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.form input {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #d0d5dd;
  font-size: 14px;
}

.search {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #d0d5dd;
  margin-bottom: 14px;
}

.btn {
  padding: 12px 18px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.btn.primary {
  background: #4f46e5;
  color: white;
}

.btn.primary:hover {
  background: #4338ca;
}

.table-wrap {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  text-align: left;
  padding: 12px;
  background: #f1f3f5;
  font-weight: 600;
}

.table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.table tr:hover {
  background: #f9fafb;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: capitalize;
}

.badge.admin {
  background: #fee2e2;
  color: #991b1b;
}

.badge.cashier {
  background: #dcfce7;
  color: #166534;
}

.icon {
  background: #f3f4f6;
  border: none;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
}

.icon.danger:hover {
  background: #fee2e2;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
}

.pagination button {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.center {
  text-align: center;
  padding: 20px;
}

.muted {
  color: #6b7280;
}
`;
