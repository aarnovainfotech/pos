const service = require('./dashboard.service');

exports.overview = (req, res) => {
  res.json({
    success: true,
    data: {
      kpis: service.getKPIs(),
      salesTrend: service.getSalesTrend(),
      topProducts: service.getTopProducts(),
      lowStock: service.getLowStock()
    }
  });
};
