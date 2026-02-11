PRAGMA foreign_keys = OFF;

ALTER TABLE sales RENAME TO sales_old;

CREATE TABLE sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_no TEXT NOT NULL UNIQUE,
  subtotal REAL NOT NULL,
  gst_total REAL NOT NULL DEFAULT 0,
  discount_total REAL NOT NULL DEFAULT 0,
  grand_total REAL NOT NULL,
  payment_method TEXT NOT NULL,
  cashier_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sales (
  id, invoice_no, subtotal, gst_total,
  discount_total, grand_total, payment_method, cashier_id, created_at
)
SELECT
  id,
  COALESCE(invoice_no, 'FIXED-' || id),
  subtotal,
  gst_total,
  discount_total,
  grand_total,
  payment_method,
  cashier_id,
  created_at
FROM sales_old;

DROP TABLE sales_old;

PRAGMA foreign_keys = ON;



SELECT id, username, password, role FROM users;

ALTER TABLE product_variants
ADD COLUMN reorder_level INTEGER DEFAULT 5;


CREATE TABLE app_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shop_name TEXT,
  gst_percent REAL,
  currency TEXT DEFAULT '₹',
  invoice_footer TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO app_settings (shop_name, gst_percent, currency)
VALUES ('V mart', 18, '₹');

DELETE FROM app_settings WHERE id=2;

CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100),
  phone VARCHAR(15) UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE sales ADD COLUMN customer_id INTEGER;


SELECT name FROM sqlite_master
WHERE type='table'
AND name NOT LIKE 'sqlite_%';
