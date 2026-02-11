const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(
  path.join(__dirname, '../../database/pos.sqlite')
);

exports.getAll = () => {
  return db.prepare(`
    SELECT * FROM categories ORDER BY id DESC
  `).all();
};

exports.create = ({ name }) => {
  const result = db.prepare(`
    INSERT INTO categories (name)
    VALUES (?)
  `).run(name);

  return { id: result.lastInsertRowid, name };
};

exports.update = (id, { name }) => {
  db.prepare(`
    UPDATE categories SET name = ?
    WHERE id = ?
  `).run(name, id);
};

exports.remove = (id) => {
  db.prepare(`
    DELETE FROM categories WHERE id = ?
  `).run(id);
};
