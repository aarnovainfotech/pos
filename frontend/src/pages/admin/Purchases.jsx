import { useEffect, useState } from 'react';
import { fetchVariants, stockIn } from '../../services/purchaseService';

export default function Purchases() {
  const [variants, setVariants] = useState([]);
  const [variantId, setVariantId] = useState('');
  const [qty, setQty] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setVariants(await fetchVariants());
  }

  async function submit() {
    if (!variantId || qty <= 0) {
      return alert('Select product & quantity');
    }

    const res = await stockIn({
      variant_id: Number(variantId),
      quantity: Number(qty),
      reference: 'purchase'
    });

    alert(`Stock updated. New stock: ${res.stock}`);
    setQty('');
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📥 Purchase / Stock In</h2>

      <select value={variantId} onChange={e => setVariantId(e.target.value)}>
        <option value="">Select product</option>
        {variants.map(v => (
          <option key={v.id} value={v.id}>
            {v.product_name} ({v.sku})
          </option>
        ))}
      </select>

      <br /><br />

      <input
        type="number"
        min="1"
        placeholder="Quantity"
        value={qty}
        onChange={e => setQty(e.target.value)}
      />

      <br /><br />

      <button onClick={submit}>Stock In</button>
    </div>
  );
}
