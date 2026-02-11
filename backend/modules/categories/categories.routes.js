const express = require('express');
const router = express.Router();

const controller = require('./categories.controller');
const { auth } = require('../../middleware/auth.middleware');
const { adminOnly } = require('../../middleware/role.middleware');

router.get('/categories', auth, controller.list);
router.post('/categories', auth, adminOnly, controller.create);
router.put('/categories/:id', auth, adminOnly, controller.update);
router.delete('/categories/:id', auth, adminOnly, controller.remove);

module.exports = router;
