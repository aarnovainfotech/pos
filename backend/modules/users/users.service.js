const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new Database(
  path.join(__dirname, '../../database/pos.sqlite')
);

exports.getAll = () => {
  return db.prepare(`
    SELECT id, name, username, role, status, created_at
    FROM users
    ORDER BY id DESC
  `).all();
};

exports.create = ({ name, username, password, role }) => {
  const hash = bcrypt.hashSync(password, 10);

  const result = db.prepare(`
    INSERT INTO users (name, username, password, role, status)
    VALUES (?, ?, ?, ?, 1)
  `).run(name, username, hash, role);

  return {
    id: result.lastInsertRowid,
    name,
    username,
    role,
    status: 1
  };
};

exports.update = (id, { name, role, status }) => {
  db.prepare(`
    UPDATE users
    SET name = ?, role = ?, status = ?
    WHERE id = ?
  `).run(name, role, status, id);
};

exports.remove = (id) => {
  db.prepare(`
    DELETE FROM users
    WHERE id = ?
  `).run(id);
};

exports.findByUsername = (username) => {
  return db.prepare(`
    SELECT * FROM users WHERE username = ? LIMIT 1
  `).get(username);
};
