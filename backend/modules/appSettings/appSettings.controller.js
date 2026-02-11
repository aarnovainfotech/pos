const settings = require('./appSettings.service');


exports.list = (req, res) => {
  const data = settings.getAll();
  res.json({ success: true, data });
};

exports.update = (req, res) => {
  settings.update(req.params.id, req.body);
  res.json({ success: true });
};
