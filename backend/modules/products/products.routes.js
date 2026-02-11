const express = require('express');
const router = express.Router();

const controller = require('./products.controller');
const { auth } = require('../../middleware/auth.middleware');
const { adminOnly } = require('../../middleware/role.middleware');

router.get('/products', auth, controller.list);
router.post('/products', auth, adminOnly, controller.create);
router.put('/products/:id', auth, adminOnly, controller.update);
router.delete('/products/:id', auth, adminOnly, controller.remove);

module.exports = router;
