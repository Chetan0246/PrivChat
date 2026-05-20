const express = require('express');
const router = express.Router();
const passport = require('./auth');

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
});

// Logout route
router.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ ok: true });
  });
});

module.exports = router;
