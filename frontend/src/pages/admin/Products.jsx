import { useEffect, useState, useRef } from 'react';
import { productService } from '../../services/productService';
import './products.css';

const PAGE_SIZE = 5;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const nameRef = useRef();
  const searchRef = useRef();

  const [form, setForm] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    load();
  }, []);

  /* Keyboard shortcuts */
  useEffect(() => {
    const handler = e => {
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        reset();
        nameRef.current?.focus();
      }

      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        searchRef.current?.focus();
      }

      if (e.key === 'Escape') reset();

      if (e.key === 'Delete' && selectedId) {
        handleDelete(selectedId);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedId]);

  async function load() {
    const res = await productService.getAll();
    setProducts(res.data);
  }

  async function submit(e) {
    e.preventDefault();
    editingId
      ? await productService.update(editingId, form)
      : await productService.create(form);

    reset();
    load();
  }

  function edit(p) {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.description || '' });
    nameRef.current?.focus();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return;
    await productService.delete(id);
    setSelectedId(null);
    load();
  }

  function reset() {
    setEditingId(null);
    setSelectedId(null);
    setForm({ name: '', description: '' });
  }

  /* Search + Pagination */
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="products-page">
      <div className="products-container">
        <h1>📦 Products</h1>

        {/* Search */}
        <input
          ref={searchRef}
          className="search"
          placeholder="Search products (Ctrl + F)"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* Form */}
        <form onSubmit={submit} className="product-form">
          <input
            ref={nameRef}
            placeholder="Product name (Ctrl + N)"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={e =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <div className="form-actions">
            <button className="btn primary">
              {editingId ? 'Update' : 'Add'}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn ghost"
                onClick={reset}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Table */}
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(p => (
              <tr
                key={p.id}
                className={selectedId === p.id ? 'selected' : ''}
                onClick={() => setSelectedId(p.id)}
              >
                <td>{p.name}</td>
                <td className="muted">{p.description}</td>
                <td className="actions">
                  <button onClick={() => edit(p)}>✏️</button>
                  <button onClick={() => handleDelete(p.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            ◀
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
