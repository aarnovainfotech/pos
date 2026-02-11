import { useEffect, useState } from 'react';
import { stockService } from '../../services/stockService';

export default function LowStock() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await stockService.getLowStock();
    setItems(res.data);
  }

  return (
    <div>
      <h2 style={{ color: '#c0392b' }}>🚨 Low Stock Alert</h2>

      {items.length === 0 ? (
        <p style={{ color: 'green' }}>✅ All products are sufficiently stocked</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Current Stock</th>
              <th>Reorder Level</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {items.map(i => (
              <tr key={i.id} style={{ background: '#ffe6e6' }}>
                <td>{i.product_name}</td>
                <td>{i.sku}</td>
                <td>{i.stock_quantity}</td>
                <td>{i.reorder_level}</td>
                <td>
                  <span style={{ color: 'red', fontWeight: 'bold' }}>
                    LOW
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
