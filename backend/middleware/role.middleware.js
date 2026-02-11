exports.adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }
    next();
  };
  
  exports.cashierOnly = (req, res, next) => {
    if (!['admin', 'cashier'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
  