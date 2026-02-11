const service = require('./stock.service');

exports.list = (req, res) => {
  const data = service.getAll();
  res.json({ success: true, data });
};

exports.stockIn = (req, res) => {
  service.stockIn(req.body);
  res.json({ success: true });
};

exports.stockOut = (req, res) => {
  service.stockOut(req.body);
  res.json({ success: true });
};

exports.lowStock = (req, res) => {
  const data = service.getLowStock();
  res.json({ success: true, data });
};