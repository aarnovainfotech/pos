const service = require('./sales.service');

exports.createSale = (req, res) => {
  try {
    const result = service.createSale(req.body);
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message });
  }
};

exports.getSale = (req, res) => {
  try {
    res.json(service.getSale(req.params.id));
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};
