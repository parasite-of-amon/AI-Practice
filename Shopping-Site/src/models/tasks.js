const { getDB } = require('../db/database');

async function query(sql, ...params) {
  const db = await getDB();
  const conn = await db.connect();
  try {
    const stmt = await conn.prepare(sql);
    const result = await stmt.run(...params);
    return result.getRowsJson();
  } finally {
    await conn.close();
  }
}

async function run(sql, ...params) {
  const db = await getDB();
  const conn = await db.connect();
  try {
    const stmt = await conn.prepare(sql);
    await stmt.run(...params);
  } finally {
    await conn.close();
  }
}

async function findAll({ status, priority } = {}) {
  let sql = 'SELECT * FROM tasks';
  const conditions = [];
  const args = [];

  if (status) { conditions.push(`status = ?`); args.push(status); }
  if (priority) { conditions.push(`priority = ?`); args.push(priority); }
  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
  sql += ' ORDER BY created_at DESC';

  return query(sql, ...args);
}

async function findById(id) {
  const rows = await query('SELECT * FROM tasks WHERE id = ?', id);
  return rows[0] || null;
}

async function create({ title, body = '', status = 'todo', priority = 'medium' }) {
  const db = await getDB();
  const conn = await db.connect();
  try {
    const id = (await conn.run("SELECT nextval('tasks_id_seq') AS id")).getRowsJson()[0].id;
    await conn.run(
      'INSERT INTO tasks (id, title, body, status, priority) VALUES (?, ?, ?, ?, ?)',
      id, title, body, status, priority
    );
    const rows = await conn.run('SELECT * FROM tasks WHERE id = ?', id);
    return rows.getRowsJson()[0];
  } finally {
    await conn.close();
  }
}

async function update(id, fields) {
  const allowed = ['title', 'body', 'status', 'priority'];
  const updates = Object.keys(fields).filter(k => allowed.includes(k));
  if (!updates.length) return findById(id);

  const sql = `UPDATE tasks SET ${updates.map(k => `${k} = ?`).join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
  const values = [...updates.map(k => fields[k]), id];
  await run(sql, ...values);
  return findById(id);
}

async function remove(id) {
  await run('DELETE FROM tasks WHERE id = ?', id);
}

module.exports = { findAll, findById, create, update, remove };
