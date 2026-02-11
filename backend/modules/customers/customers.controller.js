const service = require('./customers.service');

/* =========================
   FIND CUSTOMER BY PHONE
========================= */
exports.findByPhone = (req, res) => {
  try {
    const customer = service.findByPhone(req.params.phone);

    if (!customer) {
      return res.status(404).json(null);
    }

    res.json(customer);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message });
  }
};

/* =========================
   CREATE CUSTOMER
========================= */
exports.createCustomer = (req, res) => {
  try {
    const customer = service.createCustomer(req.body);
    res.json(customer);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message });
  }
};
