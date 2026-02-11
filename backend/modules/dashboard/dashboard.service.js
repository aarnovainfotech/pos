const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(
  path.join(__dirname, '../../database/pos.sqlite')
);

/* =========================
   KPI COUNTS
========================= */
exports.getKPIs = () => {
  return {
    users: db.prepare(`SELECT COUNT(*) as count FROM users`).get().count,
    products: db.prepare(`SELECT COUNT(*) as count FROM products`).get().count,
    customers: db.prepare(`SELECT COUNT(*) as count FROM customers`).get().count,
    sales: db.prepare(`
      SELECT IFNULL(SUM(grand_total), 0) as total
      FROM sales
    `).get().total
  };
};

/* =========================
   SALES TREND (LAST 7 DAYS)
========================= */
exports.getSalesTrend = () => {
  return db.prepare(`
    SELECT DATE(created_at) as date,
           SUM(grand_total) as total
    FROM sales
    GROUP BY DATE(created_at)
    ORDER BY date DESC
    LIMIT 7
  `).all().reverse();
};

/* =========================
   TOP SELLING PRODUCTS
========================= */
exports.getTopProducts = () => {
  return db.prepare(`
    SELECT p.name,
           SUM(si.quantity) as qty
    FROM sale_items si
    JOIN product_variants pv ON pv.id = si.variant_id
    JOIN products p ON p.id = pv.product_id
    GROUP BY p.id
    ORDER BY qty DESC
    LIMIT 5
  `).all();
};

/* =========================
   LOW STOCK ALERTS
========================= */
exports.getLowStock = () => {
  return db.prepare(`
    SELECT p.name, pv.stock_quantity
    FROM product_variants pv
    JOIN products p ON p.id = pv.product_id
    WHERE pv.stock_quantity <= 5
    ORDER BY pv.stock_quantity ASC
  `).all();
};
