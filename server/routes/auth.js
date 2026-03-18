const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, nextId, now } = require('../db');
const { authenticate, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'All fields required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const existing = db.get('users').find({ email: email.toLowerCase() }).value();
  if (existing) return res.status(409).json({ error: 'Email already in use' });

  const user = {
    id: nextId('users'),
    email: email.toLowerCase(),
    password_hash: bcrypt.hashSync(password, 10),
    name,
    role: 'organizer',
    created_at: now()
  };
  db.get('users').push(user).write();

  const payload = { id: user.id, email: user.email, name: user.name, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: payload });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const row = db.get('users').find({ email: email.toLowerCase() }).value();
  if (!row || !bcrypt.compareSync(password, row.password_hash))
    return res.status(401).json({ error: 'Invalid credentials' });

  const payload = { id: row.id, email: row.email, name: row.name, role: row.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: payload });
});

router.get('/me', authenticate, (req, res) => {
  const row = db.get('users').find({ id: req.user.id }).value();
  if (!row) return res.status(404).json({ error: 'Not found' });
  const { password_hash, ...user } = row;
  res.json(user);
});

module.exports = router;
