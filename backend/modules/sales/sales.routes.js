const express = require('express');
const router = express.Router();

const controller = require('./sales.controller');
const { auth } = require('../../middleware/auth.middleware');

// 🧾 CREATE SALE (POS)
// cashier + admin
router.post('/sales', auth, controller.createSale);

// 🔍 GET SINGLE SALE (invoice view / reprint)
router.get('/sales/:id', auth, controller.getSale);

module.exports = router;
