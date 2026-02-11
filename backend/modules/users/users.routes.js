const express = require('express');
const router = express.Router();

const controller = require('./users.controller');
const { auth } = require('../../middleware/auth.middleware');
const { adminOnly } = require('../../middleware/role.middleware');

/* Admin-only user management */
router.get('/users', auth, adminOnly, controller.list);
router.post('/users/cashier', auth, adminOnly, controller.createCashier);
router.put('/users/:id', auth, adminOnly, controller.update);
router.delete('/users/:id', auth, adminOnly, controller.remove);

module.exports = router;
