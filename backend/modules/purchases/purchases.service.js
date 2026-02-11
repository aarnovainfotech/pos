exports.createPurchase = ({ items }) => {
    const trx = db.transaction(() => {
      items.forEach(i => {
  
        // 📥 STOCK IN
        db.prepare(`
          INSERT INTO stock_transactions
          (variant_id, type, quantity, reference)
          VALUES (?, 'IN', ?, 'purchase')
        `).run(i.variant_id, i.quantity);
  
        db.prepare(`
          UPDATE product_variants
          SET stock_quantity = stock_quantity + ?
          WHERE id = ?
        `).run(i.quantity, i.variant_id);
      });
    });
  
    trx();
  };
  