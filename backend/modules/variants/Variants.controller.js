const service = require('./variants.service');

exports.list = (req, res) => {
  const data = service.getAll();
  res.json({ success: true, data });
};

exports.create = (req, res) => {
  const variant = service.create(req.body);
  res.json({ success: true, variant });
};

exports.update = (req, res) => {
  const variant = service.update(req.params.id, req.body);
  res.json({ success: true, variant });
};

exports.remove = (req, res) => {
  service.remove(req.params.id);
  res.json({ success: true });
};
/* ============================
   GET BY BARCODE (POS)
============================ */
exports.getByBarcode = (req, res) => {
  try {
    const barcode = req.params.barcode;
    const variant = service.getVariantByBarcode(barcode);
    res.json(variant);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};