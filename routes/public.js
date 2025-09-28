const express = require('express');
const router = express.Router();

// Public API endpoints (for your election matcher frontend)
router.get('/candidates', (req, res) => {
  // This will serve candidate data to your public election matcher
  res.json({
    message: 'Public candidates API - coming soon',
    candidates: []
  });
});

router.get('/elections', (req, res) => {
  res.json({
    message: 'Public elections API - coming soon', 
    elections: []
  });
});

module.exports = router;