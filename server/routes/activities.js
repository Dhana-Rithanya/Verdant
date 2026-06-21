import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import db from '../db.js';

const router = Router();

// All routes require auth
router.use(authMiddleware);

// GET /api/activities — list activities for user (optional ?weeks=N)
router.get('/', (req, res) => {
  try {
    const weeks = parseInt(req.query.weeks) || 52;
    const since = new Date();
    since.setDate(since.getDate() - weeks * 7);
    const sinceStr = since.toISOString().slice(0, 10);

    const rows = db.prepare(
      'SELECT * FROM activities WHERE user_id = ? AND date >= ? ORDER BY date DESC, created_at DESC'
    ).all(req.userId, sinceStr);

    res.json({ activities: rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// POST /api/activities — create a new activity
router.post('/', (req, res) => {
  const { category, type, value, co2e, details, date } = req.body;

  if (!category || !type || value === undefined || co2e === undefined) {
    return res.status(400).json({ error: 'category, type, value, and co2e are required' });
  }

  try {
    const result = db.prepare(
      'INSERT INTO activities (user_id, category, type, value, co2e, details, date) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(req.userId, category, type, value, co2e, details || '', date || new Date().toISOString().slice(0, 10));

    const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ activity });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

// DELETE /api/activities/:id
router.delete('/:id', (req, res) => {
  try {
    const activity = db.prepare('SELECT * FROM activities WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
    if (!activity) return res.status(404).json({ error: 'Activity not found' });

    db.prepare('DELETE FROM activities WHERE id = ?').run(req.params.id);
    res.json({ message: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

// GET /api/activities/weekly — get weekly aggregates for last N weeks
router.get('/weekly', (req, res) => {
  try {
    const weeks = parseInt(req.query.weeks) || 6;
    const rows = db.prepare(`
      SELECT
        date(date, 'weekday 1', '-7 days') AS week_start,
        category,
        SUM(co2e) AS total_co2e,
        COUNT(*) AS count
      FROM activities
      WHERE user_id = ?
        AND date >= date('now', ?)
      GROUP BY week_start, category
      ORDER BY week_start ASC
    `).all(req.userId, `-${weeks * 7} days`);

    // Reorganise into per-week buckets
    const weekMap = {};
    rows.forEach((row) => {
      if (!weekMap[row.week_start]) {
        weekMap[row.week_start] = { weekStart: row.week_start, totals: {}, total: 0 };
      }
      weekMap[row.week_start].totals[row.category] = row.total_co2e;
      weekMap[row.week_start].total += row.total_co2e;
    });

    res.json({ weeks: Object.values(weekMap) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch weekly data' });
  }
});

export default router;