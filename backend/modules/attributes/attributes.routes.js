const express = require('express');
const router = express.Router();

const controller = require('./attributes.controller');
const { auth } = require('../../middleware/auth.middleware');
const { adminOnly } = require('../../middleware/role.middleware');

// attributes
router.get('/attributes', auth, controller.list);
router.post('/attributes', auth, adminOnly, controller.create);
router.put('/attributes/:id', auth, adminOnly, controller.update);
router.delete('/attributes/:id', auth, adminOnly, controller.remove);

// attribute values
router.post('/attributes/:id/values', auth, adminOnly, controller.addValue);
router.delete('/attribute-values/:id', auth, adminOnly, controller.removeValue);
router.get('/attributes/with-values', auth, controller.listWithValues);
module.exports = router;
