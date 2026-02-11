const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(
  path.join(__dirname, '../../database/pos.sqlite')
);

/* =========================
   FIND CUSTOMER BY PHONE
========================= */
exports.findByPhone = (phone) => {
  return db.prepare(`
    SELECT id, name, phone
    FROM customers
    WHERE phone = ?
  `).get(phone);
};

/* =========================
   CREATE CUSTOMER
========================= */
exports.createCustomer = ({ name, phone }) => {
  if (!phone) {
    throw new Error('Phone number is required');
  }

  // prevent duplicate customers
  const existing = exports.findByPhone(phone);
  if (existing) return existing;

  const result = db.prepare(`
    INSERT INTO customers (name, phone)
    VALUES (?, ?)
  `).run(
    name || null,
    phone
  );

  return {
    id: result.lastInsertRowid,
    name,
    phone
  };
};
