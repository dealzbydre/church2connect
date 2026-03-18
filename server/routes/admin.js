const express = require('express');
const { db } = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate, requireRole('admin'));

router.get('/stats', (_req, res) => {
  const users = db.get('users').filter(u => u.role !== 'admin').value().length;
  const churches = db.get('churches').value().length;
  const pending_churches = db.get('churches').filter({ status: 'pending' }).value().length;
  const events = db.get('events').value().length;
  const pending_events = db.get('events').filter({ status: 'pending' }).value().length;
  res.json({ users, churches, pending_churches, events, pending_events });
});

router.get('/churches', (_req, res) => {
  const churches = db.get('churches').value();
  const users = db.get('users').value();
  const result = churches.map(c => {
    const owner = users.find(u => u.id === c.user_id) || {};
    return { ...c, owner_email: owner.email, owner_name: owner.name };
  }).sort((a, b) => b.created_at.localeCompare(a.created_at));
  res.json(result);
});

router.put('/churches/:id/status', (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  db.get('churches').find({ id: Number(req.params.id) }).assign({ status }).write();
  res.json({ ok: true });
});

router.delete('/churches/:id', (req, res) => {
  const id = Number(req.params.id);
  db.get('events').remove({ church_id: id }).write();
  db.get('churches').remove({ id }).write();
  res.json({ ok: true });
});

router.get('/events', (_req, res) => {
  const events = db.get('events').value();
  const churches = db.get('churches').value();
  const result = events.map(e => {
    const ch = churches.find(c => c.id === e.church_id) || {};
    return { ...e, church_name: ch.name };
  }).sort((a, b) => b.created_at.localeCompare(a.created_at));
  res.json(result);
});

router.put('/events/:id/status', (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  db.get('events').find({ id: Number(req.params.id) }).assign({ status }).write();
  res.json({ ok: true });
});

router.delete('/events/:id', (req, res) => {
  db.get('events').remove({ id: Number(req.params.id) }).write();
  res.json({ ok: true });
});

router.get('/users', (_req, res) => {
  const users = db.get('users').value()
    .map(({ password_hash, ...u }) => u)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  res.json(users);
});

router.delete('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = db.get('users').find({ id }).value();
  if (user?.role === 'admin') return res.status(403).json({ error: 'Cannot delete admin' });
  db.get('users').remove({ id }).write();
  res.json({ ok: true });
});

module.exports = router;
