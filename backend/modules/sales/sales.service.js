const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(
  path.join(__dirname, '../../database/pos.sqlite')
);
function generateInvoiceNo(db) {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  const row = db.prepare(`
    SELECT COUNT(id) AS count
    FROM sales
    WHERE invoice_no LIKE ?
  `).get(`INV-${today}-%`);

  const count = Number(row?.count || 0);
  const next = String(count + 1).padStart(4, '0');

  return `INV-${today}-${next}`;
}


exports.createSale = (data) => {
  const trx = db.transaction((data) => {

    const invoiceNo = generateInvoiceNo(db);

    if (typeof invoiceNo !== 'string') {
      throw new Error('Invoice number generation failed');
    }

    const sale = db.prepare(`
      INSERT INTO sales
      (customer_id,invoice_no, subtotal, gst_total, discount_total, grand_total, payment_method, cashier_id)
      VALUES (?,?, ?, ?, ?, ?, ?, ?)
    `).run(
      Number(data.customer_id),
      invoiceNo,
      Number(data.subtotal),
      Number(data.gst_total || 0),
      Number(data.discount_total || 0),
      Number(data.grand_total),
      String(data.payment_method),
      Number(data.cashier_id)
    );

    const saleId = sale.lastInsertRowid;

    const insertItem = db.prepare(`
      INSERT INTO sale_items
      (sale_id, variant_id, quantity, price, gst_percent, gst_amount, total)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const stockOut = db.prepare(`
      UPDATE product_variants
      SET stock_quantity = stock_quantity - ?
      WHERE id = ? AND stock_quantity >= ?
    `);

    const stockLog = db.prepare(`
      INSERT INTO stock_transactions
      (variant_id, type, quantity, reference, reference_id)
      VALUES (?, 'OUT', ?, 'sale', ?)
    `);

    for (const item of data.items) {
      const updated = stockOut.run(
        item.quantity,
        item.variant_id,
        item.quantity
      );

      if (updated.changes === 0) {
        throw new Error('Insufficient stock');
      }

      insertItem.run(
        saleId,
        item.variant_id,
        item.quantity,
        item.price,
        item.gst_percent,
        item.gst_amount,
        item.total
      );

      stockLog.run(
        item.variant_id,
        item.quantity,
        saleId
      );
    }

    const paymentStmt = db.prepare(`
      INSERT INTO payments (sale_id, method, amount)
      VALUES (?, ?, ?)
    `);

    for (const p of data.payments) {
      paymentStmt.run(saleId, p.method, p.amount);
    }

    return {
      sale_id: saleId,
      invoice_no: invoiceNo
    };
  });

  return trx(data);
};


exports.getSale = (id) => {
  const sale = db.prepare(`
    SELECT * FROM sales WHERE id = ?
  `).get(id);

  if (!sale) throw new Error('Sale not found');

  sale.items = db.prepare(`
    SELECT si.*, pv.sku
    FROM sale_items si
    JOIN product_variants pv ON pv.id = si.variant_id
    WHERE si.sale_id = ?
  `).all(id);

  sale.payments = db.prepare(`
    SELECT * FROM payments WHERE sale_id = ?
  `).all(id);

  return sale;
};
