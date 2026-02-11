/**
 * SmartPOS Database Migration
 * Technology: Node.js + SQLite (better-sqlite3)
 * Author: Architecture-approved schema
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'pos.sqlite');
const db = new Database(dbPath);

console.log('📦 Running SmartPOS database migrations...');

db.exec(`
PRAGMA foreign_keys = ON;

-- =========================
-- USERS & AUTH
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK(role IN ('admin','cashier')) NOT NULL,
  status INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- CATEGORIES
-- =========================
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  status INTEGER DEFAULT 1
);

-- =========================
-- ATTRIBUTES (Size, Color, Brand, Fabric, etc.)
-- =========================
CREATE TABLE IF NOT EXISTS attributes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,                 -- Color, Size, Brand
  input_type TEXT DEFAULT 'select',   -- select, text
  status INTEGER DEFAULT 1
);

-- =========================
-- ATTRIBUTE VALUES (Red, XL, Nike)
-- =========================
CREATE TABLE IF NOT EXISTS attribute_values (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  attribute_id INTEGER NOT NULL,
  value TEXT NOT NULL,
  FOREIGN KEY (attribute_id) REFERENCES attributes(id) ON DELETE CASCADE
);

-- =========================
-- PRODUCTS (Base Product)
-- =========================
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,                 -- Shirt, Shoe, Mobile
  category_id INTEGER,
  description TEXT,
  status INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- =========================
-- PRODUCT VARIANTS (SELLABLE ITEMS)
-- =========================
CREATE TABLE IF NOT EXISTS product_variants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  sku TEXT UNIQUE,
  barcode TEXT UNIQUE,
  cost_price REAL DEFAULT 0,
  selling_price REAL NOT NULL,
  gst_percent REAL DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  min_stock_alert INTEGER DEFAULT 5,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =========================
-- VARIANT ATTRIBUTES MAPPING
-- =========================
CREATE TABLE IF NOT EXISTS variant_attributes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  variant_id INTEGER NOT NULL,
  attribute_id INTEGER NOT NULL,
  attribute_value_id INTEGER NOT NULL,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
  FOREIGN KEY (attribute_id) REFERENCES attributes(id),
  FOREIGN KEY (attribute_value_id) REFERENCES attribute_values(id)
);

-- =========================
-- STOCK TRANSACTIONS (AUDIT SAFE)
-- =========================
CREATE TABLE IF NOT EXISTS stock_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  variant_id INTEGER NOT NULL,
  type TEXT CHECK(type IN ('IN','OUT')) NOT NULL,
  quantity INTEGER NOT NULL,
  reference TEXT,                     -- sale, purchase, adjustment
  reference_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);

-- =========================
-- SALES (INVOICE MASTER)
-- =========================
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

-- =========================
-- SALE ITEMS (PER VARIANT)
-- =========================
CREATE TABLE IF NOT EXISTS sale_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sale_id INTEGER NOT NULL,
  variant_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  gst_percent REAL DEFAULT 0,
  gst_amount REAL DEFAULT 0,
  total REAL NOT NULL,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);

-- =========================
-- PAYMENTS (MULTI MODE)
-- =========================
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sale_id INTEGER NOT NULL,
  method TEXT,                        -- cash, upi, card
  amount REAL NOT NULL,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
);

-- =========================
-- COUPONS & DISCOUNTS
-- =========================
CREATE TABLE IF NOT EXISTS coupons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  type TEXT CHECK(type IN ('flat','percentage')),
  value REAL NOT NULL,
  min_bill_amount REAL DEFAULT 0,
  max_discount REAL,
  expiry_date DATE,
  status INTEGER DEFAULT 1
);

-- =========================
-- LICENSE MANAGEMENT
-- =========================
CREATE TABLE IF NOT EXISTS licenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  license_key TEXT UNIQUE NOT NULL,
  machine_hash TEXT NOT NULL,
  issued_to TEXT,
  start_date DATE,
  expiry_date DATE,
  status INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_product_variants_barcode
ON product_variants(barcode);

CREATE INDEX IF NOT EXISTS idx_stock_variant
ON stock_transactions(variant_id);


CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100),
  phone VARCHAR(15) UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

`);

console.log('✅ SmartPOS database migrated successfully!');
