const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const jwt = require('jsonwebtoken');

const dbPath = path.join(__dirname, '../database/pos.sqlite');
const db = new Database(dbPath);

const JWT_SECRET = 'POS_SECRET';

exports.login = ({ username, password }) => {
  const user = db.prepare(`
    SELECT id, name, username, password, role
    FROM users
    WHERE username = ? AND status = 1
  `).get(username);

  if (!user) throw new Error('Invalid credentials');

  const ok = bcrypt.compareSync(password, user.password);
  if (!ok) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: user.id, role: user.role },
    'POS_SECRET',
    { expiresIn: '12h' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role
    }
  };
};
