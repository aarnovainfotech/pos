const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(
  path.join(__dirname, '../../database/pos.sqlite')
);

exports.create = (attribute_id, { value }) => {
  const result = db.prepare(`
    INSERT INTO attribute_values (attribute_id, value)
    VALUES (?, ?)
  `).run(attribute_id, value);

  return { id: result.lastInsertRowid, value };
};

exports.remove = (id) => {
  db.prepare(`
    DELETE FROM attribute_values WHERE id = ?
  `).run(id);
};
