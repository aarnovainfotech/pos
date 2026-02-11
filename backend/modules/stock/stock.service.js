const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(
  path.join(__dirname, '../../database/pos.sqlite')
);

/* 📋 LIST */
exports.getAll = () => {
  return db.prepare(`
    SELECT s.*,
           v.sku, v.barcode,
           p.name AS product_name
    FROM stock_transactions s
    JOIN product_variants v ON v.id = s.variant_id
    JOIN products p ON p.id = v.product_id
    ORDER BY s.id DESC
  `).all();
};

/* 📥 STOCK IN */
exports.stockIn = ({
  variant_id,
  quantity,
  reference = 'adjustment',
  reference_id = null
}) => {
  const trx = db.transaction(() => {
    db.prepare(`
      INSERT INTO stock_transactions
      (variant_id, type, quantity, reference, reference_id)
      VALUES (?, 'IN', ?, ?, ?)
    `).run(variant_id, quantity, reference, reference_id);

    db.prepare(`
      UPDATE product_variants
      SET stock_quantity = stock_quantity + ?
      WHERE id = ?
    `).run(quantity, variant_id);
  });

  trx();
};

/* 📤 STOCK OUT */
exports.stockOut = ({
  variant_id,
  quantity,
  reference = 'sale',
  reference_id = null
}) => {
  const variant = db.prepare(`
    SELECT stock_quantity FROM product_variants WHERE id = ?
  `).get(variant_id);

  if (!variant || variant.stock_quantity < quantity) {
    throw new Error('Insufficient stock');
  }

  const trx = db.transaction(() => {
    db.prepare(`
      INSERT INTO stock_transactions
      (variant_id, type, quantity, reference, reference_id)
      VALUES (?, 'OUT', ?, ?, ?)
    `).run(variant_id, quantity, reference, reference_id);

    db.prepare(`
      UPDATE product_variants
      SET stock_quantity = stock_quantity - ?
      WHERE id = ?
    `).run(quantity, variant_id);
  });

  trx();
};

exports.getLowStock = () => {
  return db.prepare(`
    SELECT
      pv.id,
      pv.sku,
      pv.stock_quantity,
      pv.reorder_level,
      p.name AS product_name
    FROM product_variants pv
    JOIN products p ON p.id = pv.product_id
    WHERE pv.stock_quantity <= pv.reorder_level
    ORDER BY pv.stock_quantity ASC
  `).all();
};
