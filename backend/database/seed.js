/**
 * SmartPOS Database Seeder
 * Seeds base users, attributes, and attribute values
 */

const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'pos.sqlite'));

console.log('🌱 Running SmartPOS database seeder...');

/* =========================
   admin USER
========================= */
db.prepare(`
  INSERT OR IGNORE INTO users (name, username, password, role)
  VALUES ('Administrator', 'admin', 'admin@123', 'admin')
`).run();

/* =========================
   DEFAULT CATEGORY
========================= */
db.prepare(`
  INSERT OR IGNORE INTO categories (id, name)
  VALUES (1, 'General')
`).run();

/* =========================
   ATTRIBUTES
========================= */
const attributes = [
  { name: 'Color', input_type: 'select' },
  { name: 'Size', input_type: 'select' },
  { name: 'Brand', input_type: 'select' },
  { name: 'Fabric', input_type: 'select' }
];

const insertAttribute = db.prepare(`
  INSERT OR IGNORE INTO attributes (name, input_type)
  VALUES (?, ?)
`);

attributes.forEach(attr => {
  insertAttribute.run(attr.name, attr.input_type);
});

/* =========================
   ATTRIBUTE VALUES
========================= */

// Fetch attribute IDs
const attributeMap = {};
db.prepare(`SELECT id, name FROM attributes`).all()
  .forEach(row => {
    attributeMap[row.name] = row.id;
  });

const attributeValues = [
  // Colors
  { attr: 'Color', value: 'Red' },
  { attr: 'Color', value: 'Blue' },
  { attr: 'Color', value: 'Black' },
  { attr: 'Color', value: 'White' },

  // Sizes
  { attr: 'Size', value: 'S' },
  { attr: 'Size', value: 'M' },
  { attr: 'Size', value: 'L' },
  { attr: 'Size', value: 'XL' },
  { attr: 'Size', value: '7' },
  { attr: 'Size', value: '8' },
  { attr: 'Size', value: '9' },
  { attr: 'Size', value: '10' },

  // Brands
  { attr: 'Brand', value: 'Nike' },
  { attr: 'Brand', value: 'Adidas' },
  { attr: 'Brand', value: 'Puma' },
  { attr: 'Brand', value: 'Generic' },

  // Fabric
  { attr: 'Fabric', value: 'Cotton' },
  { attr: 'Fabric', value: 'Polyester' },
  { attr: 'Fabric', value: 'Silk' }
];

const insertAttributeValue = db.prepare(`
  INSERT OR IGNORE INTO attribute_values (attribute_id, value)
  VALUES (?, ?)
`);

attributeValues.forEach(item => {
  const attributeId = attributeMap[item.attr];
  if (attributeId) {
    insertAttributeValue.run(attributeId, item.value);
  }
});

console.log('✅ Database seeding completed successfully!');
