const express = require('express');
const { db, nextId, now } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/categories', (_req, res) => {
  res.json(['Worship', 'Youth', 'Community', 'Education', 'Music', 'Outreach', 'Prayer', 'Sports', 'Family', 'General']);
});

router.get('/my/list', authenticate, (req, res) => {
  const church = db.get('churches').find({ user_id: req.user.id }).value();
  if (!church) return res.json([]);
  const events = db.get('events').filter({ church_id: church.id }).value()
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  res.json(events);
});

router.get('/', (req, res) => {
  const { category, state, search, from, to, church_id } = req.query;
  const churches = db.get('churches').value();

  let list = db.get('events').filter({ status: 'approved' }).value();

  if (category) list = list.filter(e => e.category === category);
  if (church_id) list = list.filter(e => e.church_id === Number(church_id));
  if (from) list = list.filter(e => e.start_date >= from);
  if (to) list = list.filter(e => e.start_date <= to);
  if (state) list = list.filter(e => {
    const ch = churches.find(c => c.id === e.church_id);
    return e.state === state || (ch && ch.state === state);
  });
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(e => {
      const ch = churches.find(c => c.id === e.church_id);
      return (e.title || '').toLowerCase().includes(s) ||
        (e.description || '').toLowerCase().includes(s) ||
        (ch && (ch.name || '').toLowerCase().includes(s));
    });
  }

  list.sort((a, b) => a.start_date.localeCompare(b.start_date));

  // Attach church info
  list = list.map(e => {
    const ch = churches.find(c => c.id === e.church_id) || {};
    return { ...e, church_name: ch.name, church_city: ch.city, church_state: ch.state, church_logo: ch.logo_url };
  });

  res.json(list);
});

router.get('/:id', (req, res) => {
  const ev = db.get('events').find({ id: Number(req.params.id), status: 'approved' }).value();
  if (!ev) return res.status(404).json({ error: 'Not found' });
  const ch = db.get('churches').find({ id: ev.church_id }).value() || {};
  res.json({ ...ev, church_name: ch.name, church_city: ch.city, church_state: ch.state, church_logo: ch.logo_url });
});

router.post('/', authenticate, (req, res) => {
  const church = db.get('churches').find({ user_id: req.user.id }).value();
  if (!church) return res.status(400).json({ error: 'Create a church profile first' });
  if (church.status !== 'approved') return res.status(400).json({ error: 'Your church profile must be approved before submitting events' });

  const { title, description, category, start_date, end_date, location, address, city, state, image_url, registration_url, is_free, cost, contact_email, contact_phone } = req.body;
  if (!title || !start_date) return res.status(400).json({ error: 'Title and start date required' });

  const event = {
    id: nextId('events'),
    church_id: church.id,
    title, description, category: category || 'General',
    start_date, end_date, location, address, city, state,
    image_url, registration_url,
    is_free: is_free ? 1 : 0, cost, contact_email, contact_phone,
    status: 'pending', created_at: now()
  };
  db.get('events').push(event).write();
  res.status(201).json(event);
});

router.put('/:id', authenticate, (req, res) => {
  const church = db.get('churches').find({ user_id: req.user.id }).value();
  if (!church) return res.status(403).json({ error: 'Forbidden' });
  const ev = db.get('events').find({ id: Number(req.params.id), church_id: church.id }).value();
  if (!ev) return res.status(404).json({ error: 'Not found' });

  const { title, description, category, start_date, end_date, location, address, city, state, image_url, registration_url, is_free, cost, contact_email, contact_phone } = req.body;
  db.get('events').find({ id: Number(req.params.id) })
    .assign({ title, description, category, start_date, end_date, location, address, city, state, image_url, registration_url, is_free: is_free ? 1 : 0, cost, contact_email, contact_phone, status: 'pending' })
    .write();
  res.json(db.get('events').find({ id: Number(req.params.id) }).value());
});

router.delete('/:id', authenticate, (req, res) => {
  const church = db.get('churches').find({ user_id: req.user.id }).value();
  if (!church) return res.status(403).json({ error: 'Forbidden' });
  db.get('events').remove({ id: Number(req.params.id), church_id: church.id }).write();
  res.json({ ok: true });
});

module.exports = router;
