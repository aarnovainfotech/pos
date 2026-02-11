const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new Database(
  path.join(__dirname, '../database/pos.sqlite')
);

const password = bcrypt.hashSync('admin123', 10);

db.prepare(`
  INSERT INTO users (name, username, password, role)
  VALUES (?, ?, ?, ?)
`).run(
  'Cashier',
  'cashier',
  password,
  'cashier'
);

console.log('✅ Admin created');
