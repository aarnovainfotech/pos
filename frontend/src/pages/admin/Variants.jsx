import { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { variantService } from '../../services/variantService';
import { attributeService } from '../../services/attributeService';

const PAGE_SIZE = 5;

/* ---------- Helpers ---------- */
function cartesian(attrs) {
  const entries = Object.entries(attrs).filter(([, v]) => v.length);
  if (!entries.length) return [];
  return entries.reduce((acc, [aid, values]) => {
    if (!acc.length) return values.map(v => ({ [aid]: v }));
    return acc.flatMap(x => values.map(v => ({ ...x, [aid]: v })));
  }, []);
}

function signature(productId, attrs) {
  return (
    productId +
    '|' +
    Object.entries(attrs)
      .sort(([a], [b]) => a - b)
      .map(([a, v]) => `${a}:${v}`)
      .join('|')
  );
}

/* ---------- Component ---------- */
export default function Variants() {
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [attributes, setAttributes] = useState([]);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  /* Bulk form */
  const [productId, setProductId] = useState('');
  const [price, setPrice] = useState('');
  const [gst, setGst] = useState('');
  const [stock, setStock] = useState('');
  const [selectedAttrs, setSelectedAttrs] = useState({});
  const [generated, setGenerated] = useState([]);
  const [duplicates, setDuplicates] = useState([]);

  /* Inline edit */
  const [editId, setEditId] = useState(null);
  const [editRow, setEditRow] = useState({});

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const [v, p, a] = await Promise.all([
      variantService.getAll(),
      productService.getAll(),
      attributeService.getAllWithValues()
    ]);
    setVariants(v.data);
    setProducts(p.data);
    setAttributes(a.data);
  }

  /* Existing variant signatures */
  const existing = variants.map(v =>
    signature(
      v.product_id,
      v.attributes.reduce((m, a) => {
        m[a.attribute_id] = a.attribute_value_id;
        return m;
      }, {})
    )
  );

  /* ---------- Bulk helpers ---------- */
  function toggleAttr(attrId, valueId) {
    const current = selectedAttrs[attrId] || [];
    setSelectedAttrs({
      ...selectedAttrs,
      [attrId]: current.includes(valueId)
        ? current.filter(v => v !== valueId)
        : [...current, valueId]
    });
  }

  function generate() {
    if (!productId) return alert('Select product');
    if (!price) return alert('Enter price');

    const combos = cartesian(selectedAttrs);
    const valid = [];
    const dup = [];

    combos.forEach(c => {
      const sig = signature(productId, c);
      existing.includes(sig) ? dup.push(c) : valid.push(c);
    });

    setGenerated(valid);
    setDuplicates(dup);
  }

  async function createBulk() {
    for (let i = 0; i < generated.length; i++) {
      await variantService.create({
        product_id: productId,
        sku: `SKU-${Date.now()}-${i + 1}`,
        barcode: `BC-${Date.now()}-${i + 1}`,
        selling_price: price,
        gst_percent: gst,
        stock_quantity: stock,
        attributes: generated[i]
      });
    }

    setGenerated([]);
    setSelectedAttrs({});
    setPrice('');
    setGst('');
    setStock('');
    loadAll();
  }

  /* ---------- Inline edit ---------- */
  function startEdit(v) {
    setEditId(v.id);
    setEditRow({
      sku: v.sku,
      selling_price: v.selling_price,
      gst_percent: v.gst_percent,
      stock_quantity: v.stock_quantity
    });
  }

  async function saveEdit(id) {
    await variantService.update(id, editRow);
    setEditId(null);
    loadAll();
  }

  async function remove(id) {
    if (!window.confirm('Delete this variant?')) return;
    await variantService.remove(id);
    loadAll();
  }

  /* ---------- Search + Pagination ---------- */
  const filtered = variants.filter(v =>
    v.product_name.toLowerCase().includes(search.toLowerCase()) ||
    v.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="page">
      <style>{css}</style>

      <div className="card">
        <h1>🎨 Product Variants</h1>

        {/* SEARCH */}
        <input
          className="search"
          placeholder="Search variants"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* BULK VARIANT CREATION */}
        <div className="bulk-card">
          <h2>Bulk Variant Generator</h2>

          <div className="grid">
            <select value={productId} onChange={e => setProductId(e.target.value)}>
              <option value="">Select Product</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
            <input placeholder="GST %" type="number" value={gst} onChange={e => setGst(e.target.value)} />
            <input placeholder="Opening Stock" type="number" value={stock} onChange={e => setStock(e.target.value)} />
          </div>

          {attributes.map(attr => (
            <div key={attr.id}>
              <label>{attr.name}</label>
              <div className="chips">
                {attr.values.map(v => (
                  <span
                    key={v.id}
                    className={`chip ${selectedAttrs[attr.id]?.includes(v.id) ? 'active' : ''}`}
                    onClick={() => toggleAttr(attr.id, v.id)}
                  >
                    {v.value}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <button className="btn secondary" onClick={generate}>
            Generate Variants
          </button>

          {duplicates.length > 0 && (
            <div className="warning">
              ⚠ {duplicates.length} duplicate variants skipped
            </div>
          )}

          {generated.length > 0 && (
            <>
              <h3>Preview ({generated.length})</h3>
              <div className="preview">
                {generated.map((g, i) => (
                  <div key={i} className="preview-item">
                    {Object.entries(g).map(([aid, vid]) => {
                      const a = attributes.find(x => x.id == aid);
                      const v = a?.values.find(x => x.id == vid);
                      return `${a?.name}: ${v?.value}`;
                    }).join(', ')}
                  </div>
                ))}
              </div>

              <button className="btn primary" onClick={createBulk}>
                Create {generated.length} Variants
              </button>
            </>
          )}
        </div>

        {/* VARIANT LIST */}
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Price</th>
              <th>GST</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(v => (
              <tr key={v.id}>
                <td>{v.product_name}</td>

                <td>
                  {editId === v.id ? (
                    <input value={editRow.sku}
                      onChange={e => setEditRow({ ...editRow, sku: e.target.value })} />
                  ) : v.sku}
                </td>

                <td>
                  {editId === v.id ? (
                    <input type="number" value={editRow.selling_price}
                      onChange={e => setEditRow({ ...editRow, selling_price: e.target.value })} />
                  ) : `₹${v.selling_price}`}
                </td>

                <td>
                  {editId === v.id ? (
                    <input type="number" value={editRow.gst_percent}
                      onChange={e => setEditRow({ ...editRow, gst_percent: e.target.value })} />
                  ) : `${v.gst_percent}%`}
                </td>

                <td>
                  {editId === v.id ? (
                    <input type="number" value={editRow.stock_quantity}
                      onChange={e => setEditRow({ ...editRow, stock_quantity: e.target.value })} />
                  ) : v.stock_quantity}
                </td>

                <td className="actions">
                  {editId === v.id ? (
                    <>
                      <button onClick={() => saveEdit(v.id)}>💾</button>
                      <button onClick={() => setEditId(null)}>✖</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(v)}>✏️</button>
                      <button onClick={() => remove(v.id)}>🗑️</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>◀</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>▶</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- CSS ---------- */
const css = `
.page {
  background:#f5f7fb;
  padding:32px;
  font-family:system-ui;
}
.card {
  background:#fff;
  max-width:1200px;
  margin:auto;
  padding:28px;
  border-radius:16px;
  box-shadow:0 10px 30px rgba(0,0,0,.08);
}
.search {
  width:100%;
  padding:14px;
  border-radius:12px;
  border:1px solid #d0d5dd;
  margin-bottom:20px;
}
.bulk-card {
  background:#fafafa;
  border:1px solid #e5e7eb;
  padding:20px;
  border-radius:14px;
  margin-bottom:30px;
}
.grid {
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:12px;
}
.grid input, .grid select {
  padding:12px;
  border-radius:10px;
  border:1px solid #d0d5dd;
}
.chips {
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin:8px 0 12px;
}
.chip {
  padding:6px 12px;
  border-radius:999px;
  border:1px solid #d0d5dd;
  cursor:pointer;
  font-size:13px;
}
.chip.active {
  background:#4f46e5;
  color:white;
  border-color:#4f46e5;
}
.preview {
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin:12px 0;
}
.preview-item {
  background:#eef2ff;
  padding:8px 12px;
  border-radius:999px;
  font-size:13px;
}
.btn {
  padding:12px 20px;
  border-radius:12px;
  border:none;
  cursor:pointer;
}
.btn.primary { background:#4f46e5; color:white; }
.btn.secondary { background:#e5e7eb; }
.warning {
  margin-top:10px;
  color:#b45309;
  font-weight:600;
}
.table {
  width:100%;
  border-collapse:collapse;
}
.table th,.table td {
  padding:12px;
  border-bottom:1px solid #eee;
}
.table input {
  width:100%;
  padding:6px 8px;
  border-radius:8px;
  border:1px solid #d0d5dd;
}
.actions button {
  margin-left:6px;
  border:none;
  padding:6px 8px;
  border-radius:8px;
  cursor:pointer;
}
.pagination {
  margin-top:16px;
  display:flex;
  justify-content:center;
  gap:14px;
}
`;
