const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const bcrypt = require('bcryptjs');

const adapter = new FileSync(path.join(__dirname, '../data.json'));
const db = low(adapter);

// Default structure
db.defaults({ users: [], churches: [], events: [], _seq: { users: 0, churches: 0, events: 0 } }).write();

// Auto-increment helper
function nextId(table) {
  const val = db.get(`_seq.${table}`).value() + 1;
  db.set(`_seq.${table}`, val).write();
  return val;
}

function now() {
  return new Date().toISOString();
}

// Seed admin
const adminExists = db.get('users').find({ email: 'admin@church2connect.com' }).value();
if (!adminExists) {
  db.get('users').push({
    id: nextId('users'),
    email: 'admin@church2connect.com',
    password_hash: bcrypt.hashSync('admin123', 10),
    name: 'Admin',
    role: 'admin',
    created_at: now()
  }).write();
}

module.exports = { db, nextId, now };
