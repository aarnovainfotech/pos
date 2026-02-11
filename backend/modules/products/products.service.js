const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(
  path.join(__dirname, '../../database/pos.sqlite')
);

exports.getAll = () => {
  return db.prepare(`
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    ORDER BY p.id DESC
  `).all();
};

exports.create = ({ name, category_id, description }) => {
  const result = db.prepare(`
    INSERT INTO products (name, category_id, description)
    VALUES (?, ?, ?)
  `).run(name, category_id || null, description || '');

  return {
    id: result.lastInsertRowid,
    name,
    category_id,
    description
  };
};

exports.update = (id, { name, category_id, description }) => {
  db.prepare(`
    UPDATE products
    SET name = ?, category_id = ?, description = ?
    WHERE id = ?
  `).run(name, category_id || null, description || '', id);
};

exports.remove = (id) => {
  db.prepare(`
    DELETE FROM products WHERE id = ?
  `).run(id);
};
