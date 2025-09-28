const express = require('express');
const router = express.Router();

// Mock authentication for demo
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Demo credentials
  if (email === 'admin@satisfactioneconomy.org' && password === 'admin123') {
    res.json({
      token: 'demo-jwt-token-' + Date.now(),
      user: {
        name: 'Admin User',
        email: email,
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

router.get('/verify', (req, res) => {
  // Mock token verification
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token && token.startsWith('demo-jwt-token')) {
    res.json({
      name: 'Admin User',
      email: 'admin@satisfactioneconomy.org',
      role: 'admin'
    });
  } else {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;