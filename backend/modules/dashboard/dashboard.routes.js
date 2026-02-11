const express = require('express');
const router = express.Router();

const controller = require('./dashboard.controller');
const { auth } = require('../../middleware/auth.middleware');
const { adminOnly } = require('../../middleware/role.middleware');

router.get('/dashboard', auth, adminOnly, controller.overview);

module.exports = router;
