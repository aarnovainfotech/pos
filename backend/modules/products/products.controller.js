const service = require('./products.service');

exports.list = (req, res) => {
  const data = service.getAll();
  res.json({ success: true, data });
};

exports.create = (req, res) => {
  const product = service.create(req.body);
  res.json({ success: true, product });
};

exports.update = (req, res) => {
  service.update(req.params.id, req.body);
  res.json({ success: true });
};

exports.remove = (req, res) => {
  service.remove(req.params.id);
  res.json({ success: true });
};
