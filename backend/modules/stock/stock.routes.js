const express = require('express');
const router = express.Router();

const controller = require('./stock.controller');
const { auth } = require('../../middleware/auth.middleware');
const { adminOnly } = require('../../middleware/role.middleware');

router.get('/stock', auth, controller.list);
router.post('/stock/in', auth, adminOnly, controller.stockIn);
router.post('/stock/out', auth, controller.stockOut);
router.get('/stock/low', auth, adminOnly, controller.lowStock);
module.exports = router;
