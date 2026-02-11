const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(
  path.join(__dirname, '../../database/pos.sqlite')
);

exports.getAllWithValues = () => {
  const attrs = db.prepare(`
    SELECT * FROM attributes ORDER BY id DESC
  `).all();

  for (const attr of attrs) {
    attr.values = db.prepare(`
      SELECT * FROM attribute_values
      WHERE attribute_id = ?
    `).all(attr.id);
  }

  return attrs;
};

exports.create = ({ name, input_type }) => {
  const result = db.prepare(`
    INSERT INTO attributes (name, input_type)
    VALUES (?, ?)
  `).run(name, input_type || 'select');

  return { id: result.lastInsertRowid, name, input_type };
};

exports.update = (id, { name, input_type }) => {
  db.prepare(`
    UPDATE attributes
    SET name = ?, input_type = ?
    WHERE id = ?
  `).run(name, input_type, id);
};

exports.remove = (id) => {
  db.prepare(`
    DELETE FROM attributes WHERE id = ?
  `).run(id);
};
