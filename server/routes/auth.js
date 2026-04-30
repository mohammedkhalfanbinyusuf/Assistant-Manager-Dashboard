const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const mongoose = require('mongoose');

  // MOCK LOGIN if DB is down
  if (mongoose.connection.readyState !== 1) {
    if (username === 'jobin' && password === 'jobin123') {
      const payload = { user: { id: 'mock-id' } };
      return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '12h' }, (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: 'mock-id', name: 'Jobin (Mock)', username: 'jobin' } });
      });
    }
    return res.status(400).json({ msg: 'Invalid Credentials (Mock Mode)' });
  }

  try {

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '12h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, username: user.username } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
