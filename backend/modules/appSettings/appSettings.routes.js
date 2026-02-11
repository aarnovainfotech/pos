const express = require('express');
const router = express.Router();

const controller = require('./appSettings.controller');
const { auth } = require('../../middleware/auth.middleware');
const { adminOnly } = require('../../middleware/role.middleware');
// appSettings
router.get('/appsettings', auth,adminOnly,controller.list);
router.put('/appsettings/:id',auth,adminOnly, controller.update);

module.exports = router;
