const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

router.post('/login', (req, res) => {
  try {
    const result = authService.login(req.body);

    res.json({
      success: true,
      token: result.token,
      user: result.user
    });

  } catch (e) {
    res.status(401).json({ success: false, message: e.message });
  }
});




module.exports = router;
