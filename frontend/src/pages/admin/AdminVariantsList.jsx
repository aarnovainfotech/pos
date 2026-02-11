import { useEffect, useState } from 'react';
import {
  fetchAllVariants,
  deleteVariant,
  fetchVariantAttributes   // ✅ FIX 1
} from '../../services/variantService';
import AdminVariantEdit from './AdminVariantEdit';

export default function AdminVariantsList() {
  const [variants, setVariants] = useState([]); // ✅ ALWAYS array
  const [attrs, setAttrs] = useState({});
  const [editing, setEditing] = useState(null); // variant object or null

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await fetchAllVariants();
    setVariants(Array.isArray(data) ? data : []);
  }

  async function loadAttrs(variantId) {
    const data = await fetchVariantAttributes(variantId);
    setAttrs(prev => ({ ...prev, [variantId]: data }));
  }

  async function handleDelete(id) {
    if (!confirm('Delete variant?')) return;
    await deleteVariant(id);
    setVariants(prev => prev.filter(v => v.id !== id)); // ✅ no reload
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📋 All Product Variants</h2>

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Barcode</th>
            <th>Price</th>
            <th>GST %</th>
            <th>Stock</th>
            <th>Attributes</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {variants.length === 0 && (
            <tr>
              <td colSpan="8" align="center"> {/* ✅ FIX 2 */}
                No variants found
              </td>
            </tr>
          )}

          {variants.map(v => (
            <tr key={v.id}>
              <td>{v.product_name}</td>
              <td>{v.sku}</td>
              <td>{v.barcode}</td>
              <td>₹{v.selling_price}</td>
              <td>{v.gst_percent}%</td>
              <td style={{ fontWeight: 'bold' }}>{v.stock}</td>

              {/* ATTRIBUTES */}
              <td>
                {attrs[v.id]
                  ? attrs[v.id].map(a => (
                      <span
                        key={a.attribute + a.value}
                        style={{
                          border: '1px solid #ccc',
                          padding: '2px 6px',
                          marginRight: 4,
                          borderRadius: 4,
                          fontSize: 12,
                          display: 'inline-block'
                        }}
                      >
                        {a.attribute}: {a.value}
                      </span>
                    ))
                  : (
                    <button onClick={() => loadAttrs(v.id)}>
                      View
                    </button>
                  )
                }
              </td>

              {/* ACTIONS */}
              <td>
              <button onClick={() => setEditing(v)}>✏️</button>
                <button onClick={() => handleDelete(v.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editing && (
  <AdminVariantEdit
    variant={editing}
    onClose={() => setEditing(null)}
    onSaved={load}
  />
)}

    </div>
  );
}
