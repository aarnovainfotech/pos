const express = require('express');
const router = express.Router();

const controller = require('./variants.controller');
const { auth } = require('../../middleware/auth.middleware');
const { adminOnly } = require('../../middleware/role.middleware');

router.get('/variants', auth, controller.list);
router.post('/variants', auth, adminOnly, controller.create);
router.put('/variants/:id', auth, adminOnly, controller.update);
router.delete('/variants/:id', auth, adminOnly, controller.remove);

router.get('/variants/barcode/:barcode', controller.getByBarcode);


module.exports = router;
