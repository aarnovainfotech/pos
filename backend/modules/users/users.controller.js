const service = require('./users.service');

/* =========================
   LIST USERS
========================= */
exports.list = (req, res) => {
  const data = service.getAll();
  res.json({
    success: true,
    data
  });
};


/* =========================
   CREATE CASHIER
========================= */
exports.createCashier = (req, res) => {
  const user = service.create({
    ...req.body,
    role: 'cashier'
  });

  res.json({ success: true, user });
};

/* =========================
   UPDATE USER
========================= */
exports.update = (req, res) => {
  service.update(req.params.id, req.body);
  res.json({ success: true });
};

/* =========================
   DELETE USER
========================= */
exports.remove = (req, res) => {
  service.remove(req.params.id);
  res.json({ success: true });
};
