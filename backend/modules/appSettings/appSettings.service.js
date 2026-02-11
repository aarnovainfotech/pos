const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(
  path.join(__dirname, '../../database/pos.sqlite')
);

exports.getAll = () => {
    return db.prepare(`
      SELECT * FROM app_settings ORDER BY id DESC
    `).all();
  };

exports.update = (id, { shop_name, gst_percent, currency ,invoice_footer}) => {
    db.prepare(`
      UPDATE app_settings
      SET shop_name=?, gst_percent=?, currency=?, invoice_footer=?
      WHERE id = ?
    `).run(shop_name, gst_percent, currency, invoice_footer, id);
  };
