const express = require('express');
const router = express.Router();

const controller = require('./customers.controller');
const { auth } = require('../../middleware/auth.middleware');

/* =========================
   CUSTOMER ROUTES
========================= */

// 🔍 Find customer by phone (POS)
router.get('/customers/phone/:phone', controller.findByPhone);

// ➕ Create customer (POS)
router.post('/customers', controller.createCustomer);

module.exports = router;
