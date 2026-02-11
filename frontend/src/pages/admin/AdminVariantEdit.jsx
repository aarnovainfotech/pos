import { useState } from 'react';
import { updateVariant } from '../../services/variantService';

export default function AdminVariantEdit({ variant, onClose, onSaved }) {
  const [price, setPrice] = useState(variant.selling_price);
  const [cost, setCost] = useState(variant.cost_price);
  const [gst, setGst] = useState(variant.gst_percent);

  async function save() {
    await updateVariant(variant.id, {
      selling_price: price,
      cost_price: cost,
      gst_percent: gst
    });
    onSaved();
    onClose();
  }

  return (
    <div className="modal">
      <h3>Edit Variant</h3>

      <input value={cost} onChange={e => setCost(e.target.value)} placeholder="Cost Price" />
      <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Selling Price" />
      <input value={gst} onChange={e => setGst(e.target.value)} placeholder="GST %" />

      <button onClick={save}>💾 Save</button>
      <button onClick={onClose}>❌ Cancel</button>
    </div>
  );
}
