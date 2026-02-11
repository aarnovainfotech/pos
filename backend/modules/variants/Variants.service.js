const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(
  path.join(__dirname, '../../database/pos.sqlite')
);

/* 🔢 BARCODE GENERATOR */
function generateBarcode() {
  return 'BC' + Math.floor(100000000 + Math.random() * 900000000);
}

/* 📥 LIST */
exports.getAll = () => {
  const variants = db.prepare(`
    SELECT v.*, p.name AS product_name
    FROM product_variants v
    JOIN products p ON p.id = v.product_id
    ORDER BY v.id DESC
  `).all();

  const attrStmt = db.prepare(`
    SELECT * FROM variant_attributes WHERE variant_id = ?
  `);

  variants.forEach(v => {
    v.attributes = attrStmt.all(v.id);
  });

  return variants;
};

/* ➕ CREATE */
exports.create = ({
  product_id,
  sku,
  barcode,
  selling_price,
  gst_percent,
  stock_quantity,
  attributes
}) => {
  const finalBarcode = barcode || generateBarcode();

  const result = db.prepare(`
    INSERT INTO product_variants
    (product_id, sku, barcode, selling_price, gst_percent, stock_quantity)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    product_id,
    sku,
    finalBarcode,
    selling_price,
    gst_percent || 0,
    stock_quantity || 0
  );

  saveAttributes(result.lastInsertRowid, attributes);

  return { id: result.lastInsertRowid };
};

/* ✏️ UPDATE */
exports.update = (id, {
  product_id,
  sku,
  barcode,
  selling_price,
  gst_percent,
  stock_quantity,
  attributes
}) => {
  db.prepare(`
    UPDATE product_variants
    SET product_id = ?, sku = ?, barcode = ?, selling_price = ?, gst_percent = ?, stock_quantity = ?
    WHERE id = ?
  `).run(
    product_id,
    sku,
    barcode,
    selling_price,
    gst_percent,
    stock_quantity,
    id
  );

  db.prepare(`DELETE FROM variant_attributes WHERE variant_id = ?`).run(id);
  saveAttributes(id, attributes);

  return { id };
};

/* ❌ DELETE */
exports.remove = (id) => {
  db.prepare(`DELETE FROM variant_attributes WHERE variant_id = ?`).run(id);
  db.prepare(`DELETE FROM product_variants WHERE id = ?`).run(id);
};

/* 🔗 ATTRIBUTE MAPPING */
function saveAttributes(variantId, attributes = {}) {
  const insert = db.prepare(`
    INSERT INTO variant_attributes
    (variant_id, attribute_id, attribute_value_id)
    VALUES (?, ?, ?)
  `);

  const trx = db.transaction(() => {
    Object.keys(attributes).forEach(attrId => {
      insert.run(variantId, attrId, attributes[attrId]);
    });
  });

  trx();
}
/* ============================
   GET VARIANT BY BARCODE
============================ */
exports.getVariantByBarcode = (barcode) => {
  const variant = db.prepare(`
    SELECT 
      pv.id,
      pv.sku,
      pv.barcode,
      pv.selling_price,
      pv.gst_percent,
      pv.stock_quantity,
      p.name AS product_name
    FROM product_variants pv
    JOIN products p ON p.id = pv.product_id
    WHERE pv.barcode = ?
  `).get(barcode);

  if (!variant) {
    throw new Error('Variant not found');
  }

  return variant;
};
