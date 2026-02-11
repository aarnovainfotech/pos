import { useState } from 'react';

export default function DiscountModal({
  discountType,
  discountValue,
  onApply,
  onClose
}) {
  const [type, setType] = useState(discountType || 'AMOUNT');
  const [value, setValue] = useState(discountValue);

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>💸 Apply Discount</h3>

        <select
          value={type}
          onChange={e => setType(e.target.value)}
          style={input}
        >
          <option value="AMOUNT">₹ Amount</option>
          <option value="PERCENT">Percentage (%)</option>
        </select>

        <input
          type="number"
          value={value}
          onChange={e => setValue(Number(e.target.value))}
          placeholder="Enter discount"
          style={input}
        />

        <div style={actions}>
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => onApply(type, value)}
            style={applyBtn}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.45)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999
};

const modal = {
  background: '#fff',
  padding: 20,
  borderRadius: 12,
  width: 300,
  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  color: '#111'
};

const input = {
  width: '80%',
  padding: 10,
  marginTop: 10,
  borderRadius: 6,
  border: '1px solid #d1d5db'
};

const actions = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: 15
};

const applyBtn = {
  background: '#16a34a',
  color: '#fff',
  border: 0,
  padding: '8px 16px',
  borderRadius: 6,
  fontWeight: 'bold'
};
