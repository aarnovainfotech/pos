import { useEffect, useMemo, useState } from 'react';
import { categoryService } from '../../services/categoryService';

const PAGE_SIZE = 5;

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await categoryService.getAll();
    setCategories(res.data);
    setLoading(false);
  }

  async function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      await categoryService.update(editingId, { name });
    } else {
      await categoryService.create({ name });
    }

    setName('');
    setEditingId(null);
    load();
  }

  function edit(cat) {
    setEditingId(cat.id);
    setName(cat.name);
  }

  async function remove(id) {
    if (!confirm('Delete category?')) return;
    await categoryService.remove(id);
    load();
  }

  /* =========================
     SEARCH + PAGINATION
  ========================= */

  const filtered = useMemo(() => {
    setPage(1);
    return categories.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      String(c.id).includes(search)
    );
  }, [search, categories]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.header}>📂 Category Management</h2>

        {/* ADD / EDIT */}
        <form onSubmit={submit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Category name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
          <button style={editingId ? styles.updateBtn : styles.addBtn}>
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => {
                setEditingId(null);
                setName('');
              }}
            >
              Cancel
            </button>
          )}
        </form>

        {/* SEARCH */}
        <input
          style={{ ...styles.input, marginBottom: 12 }}
          placeholder="🔍 Search categories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* TABLE */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" style={styles.center}>Loading...</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="3" style={styles.center}>
                    No categories found
                  </td>
                </tr>
              ) : (
                paginated.map(c => (
                  <tr key={c.id}>
                    <td style={styles.td}>{c.id}</td>
                    <td style={styles.td}>{c.name}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.editBtn}
                        onClick={() => edit(c)}
                      >
                        ✏ Edit
                      </button>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => remove(c.id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              style={styles.pageBtn}
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              ◀ Prev
            </button>

            <span style={styles.pageInfo}>
              Page {page} of {totalPages}
            </span>

            <button
              style={styles.pageBtn}
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
   STYLES
========================= */

const styles = {
  page: {
    padding: 30,
    background: '#f4f6f9',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif'
  },
  card: {
    maxWidth: 720,
    margin: 'auto',
    background: '#fff',
    padding: 24,
    borderRadius: 14,
    boxShadow: '0 10px 30px rgba(0,0,0,.08)'
  },
  header: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 20
  },
  form: {
    display: 'flex',
    gap: 10,
    marginBottom: 16
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    border: '1px solid #ccc'
  },
  addBtn: {
    background: '#0d6efd',
    color: '#fff',
    border: 'none',
    padding: '0 18px',
    borderRadius: 8,
    cursor: 'pointer'
  },
  updateBtn: {
    background: '#198754',
    color: '#fff',
    border: 'none',
    padding: '0 18px',
    borderRadius: 8
  },
  cancelBtn: {
    background: '#6c757d',
    color: '#fff',
    border: 'none',
    padding: '0 14px',
    borderRadius: 8
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: 12,
    background: '#f1f3f5',
    textAlign: 'left'
  },
  td: {
    padding: 12,
    borderBottom: '1px solid #eee'
  },
  editBtn: {
    background: '#ffc107',
    border: 'none',
    padding: '6px 12px',
    borderRadius: 6,
    marginRight: 6
  },
  deleteBtn: {
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: 6
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 16
  },
  pageBtn: {
    padding: '6px 14px',
    borderRadius: 6,
    border: '1px solid #ccc',
    background: '#fff',
    cursor: 'pointer'
  },
  pageInfo: {
    fontWeight: 500
  },
  center: {
    textAlign: 'center',
    padding: 20,
    color: '#777'
  }
};
