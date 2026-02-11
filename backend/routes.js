const express = require('express');
const router = express.Router();

//const productRoutes = require('./modules/products/product.routes');
const stockRoutes = require('./modules/stock/stock.routes');
//const categoryRoutes = require('./modules/categories/categories.routes');
//const attributeRoutes = require('./modules/attributes/attributes.routes');
const salesRoutes = require('./modules/sales/sales.routes');
// ✅ Register all module routes
//router.use(productRoutes);
router.use(stockRoutes);
//router.use(categoryRoutes);
//router.use(attributeRoutes);
router.use(salesRoutes);


const categoryRoutes = require('./modules/categories/categories.routes');
router.use(categoryRoutes);
const attributeRoutes = require('./modules/attributes/attributes.routes');
router.use(attributeRoutes);
const productRoutes = require('./modules/products/products.routes');
router.use(productRoutes);
const variantRoutes = require('./modules/variants/variants.routes');
router.use(variantRoutes);
const appSettingsRoutes = require('./modules/appSettings/appSettings.routes');
router.use(appSettingsRoutes);

const customerRoutes = require('./modules/customers/customers.routes.js');
router.use(customerRoutes);
const userRoutes = require('./modules/users/users.routes');
router.use(userRoutes);
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
router.use(dashboardRoutes);

// ✅ Health
router.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = router;
