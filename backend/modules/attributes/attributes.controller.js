const service = require('./attributes.service');
const valueService = require('./attributeValues.service');

exports.list = (req, res) => {
  const data = service.getAllWithValues();
  res.json({ success: true, data });
};

exports.create = (req, res) => {
  const attr = service.create(req.body);
  res.json({ success: true, attribute: attr });
};

exports.update = (req, res) => {
  service.update(req.params.id, req.body);
  res.json({ success: true });
};

exports.remove = (req, res) => {
  service.remove(req.params.id);
  res.json({ success: true });
};

exports.addValue = (req, res) => {
  const value = valueService.create(req.params.id, req.body);
  res.json({ success: true, value });
};

exports.removeValue = (req, res) => {
  valueService.remove(req.params.id);
  res.json({ success: true });
};
exports.listWithValues = (req, res) => {
  const data = service.getAllWithValues();
  res.json({ success: true, data });
};