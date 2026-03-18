const express = require('express');
const { db, nextId, now } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const { search, state } = req.query;
  let list = db.get('churches').value();
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(c =>
      (c.name || '').toLowerCase().includes(s) ||
      (c.description || '').toLowerCase().includes(s) ||
      (c.denomination || '').toLowerCase().includes(s)
    );
  }
  if (state) list = list.filter(c => c.state === state);
  list.sort((a, b) => a.name.localeCompare(b.name));
  res.json(list);
});

router.get('/my/profile', authenticate, (req, res) => {
  const church = db.get('churches').find({ user_id: req.user.id }).value();
  res.json(church || null);
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const church = db.get('churches').find({ id }).value();
  if (!church) return res.status(404).json({ error: 'Not found' });
  const events = db.get('events').filter({ church_id: id }).value()
    .sort((a, b) => a.start_date.localeCompare(b.start_date));
  res.json({ church, events });
});

router.post('/my/profile', authenticate, (req, res) => {
  const { name, description, address, city, state, zip, phone, email, website, denomination } = req.body;
  if (!name) return res.status(400).json({ error: 'Church name required' });

  const existing = db.get('churches').find({ user_id: req.user.id }).value();
  if (existing) {
    db.get('churches').find({ user_id: req.user.id })
      .assign({ name, description, address, city, state, zip, phone, email, website, denomination })
      .write();
    res.json(db.get('churches').find({ user_id: req.user.id }).value());
  } else {
    const church = {
      id: nextId('churches'),
      user_id: req.user.id,
      name, description, address, city, state, zip, phone, email, website, denomination,
      logo_url: null, created_at: now()
    };
    db.get('churches').push(church).write();
    res.status(201).json(church);
  }
});

module.exports = router;
