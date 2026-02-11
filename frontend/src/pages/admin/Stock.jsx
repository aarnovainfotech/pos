import { useEffect, useMemo, useState } from 'react';
import { stockService } from '../../services/stockService';
import { variantService } from '../../services/variantService';

const PAGE_SIZE = 15;

export default function Stock() {
  const [movements, setMovements] = useState([]);
  const [variants, setVariants] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    variant_id: '',
    type: 'IN',
    quantity: '',
    reason: ''
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [m, v] = await Promise.all([
      stockService.getAll(),
      variantService.getAll()
    ]);
    setMovements(m.data);
    setVariants(v.data);
  }

  async function submit(e) {
    e.preventDefault();

    const payload = {
      variant_id: Number(form.variant_id),
      quantity: Number(form.quantity),
      reference: form.reason || 'adjustment'
    };

    if (form.type === 'OUT') {
      const variant = variants.find(v => v.id == form.variant_id);
      if (variant && payload.quantity > variant.stock_quantity) {
        alert('Insufficient stock');
        return;
      }
    }

    form.type === 'IN'
      ? await stockService.stockIn(payload)
      : await stockService.stockOut(payload);

    setForm({ variant_id: '', type: 'IN', quantity: '', reason: '' });
    load();
  }

  /* ---------------- FILTER + PAGINATION ---------------- */

  const filtered = useMemo(() => {
    return movements.filter(m =>
      `${m.product_name} ${m.sku} ${m.type}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [movements, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const data = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ---------------- UI ---------------- */

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>📦 Stock Management</h2>

      {/* FORM CARD */}
      <form onSubmit={submit} style={styles.card}>
        <select
          required
          value={form.variant_id}
          onChange={e => setForm({ ...form, variant_id: e.target.value })}
          style={styles.input}
        >
          <option value="">Select Product Variant</option>
          {variants.map(v => (
            <option key={v.id} value={v.id}>
              {v.product_name} | {v.sku} | Stock: {v.stock_quantity}
            </option>
          ))}
        </select>

        <select
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
          style={styles.input}
        >
          <option value="IN">Stock In</option>
          <option value="OUT">Stock Out</option>
        </select>

        <input
          type="number"
          required
          placeholder="Quantity"
          value={form.quantity}
          onChange={e => setForm({ ...form, quantity: e.target.value })}
          style={styles.input}
        />

        <input
          placeholder="Reason (optional)"
          value={form.reason}
          onChange={e => setForm({ ...form, reason: e.target.value })}
          style={styles.input}
        />

        <button style={styles.primaryBtn}>Save</button>
      </form>

      {/* SEARCH */}
      <input
        placeholder="🔍 Search stock movement"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{ ...styles.input, width: 260, marginBottom: 12 }}
      />

      {/* TABLE CARD */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>SKU</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Reason</th>
            </tr>
          </thead>

          <tbody>
            {data.map(m => (
              <tr key={m.id}>
                <td>{m.created_at}</td>
                <td>{m.product_name}</td>
                <td>{m.sku}</td>
                <td>
                  <span
                    style={{
                      ...styles.badge,
                      background: m.type === 'IN' ? '#16a34a' : '#dc2626'
                    }}
                  >
                    {m.type}
                  </span>
                </td>
                <td>{m.quantity}</td>
                <td>{m.reason || '-'}</td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan="6" style={styles.empty}>
                  No stock movements found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div style={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          ◀ Prev
        </button>
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  wrapper: { padding: 24 },
  title: { marginBottom: 16 },

  card: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 2fr auto',
    gap: 12,
    background: '#fff',
    padding: 16,
    borderRadius: 12,
    boxShadow: '0 8px 20px rgba(0,0,0,.05)',
    marginBottom: 20
  },

  input: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #ddd',
    fontSize: 14
  },

  primaryBtn: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: 8,
    cursor: 'pointer'
  },

  tableCard: {
    background: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(0,0,0,.05)'
  },

  table: {
    width: '100%',
    
  },

  badge: {
    color: '#fff',
    padding: '4px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600
  },

  empty: {
    textAlign: 'center',
    padding: 20,
    color: '#999'
  },

  pagination: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'center',
    gap: 12
  }
};
