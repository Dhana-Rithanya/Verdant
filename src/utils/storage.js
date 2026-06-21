const STORAGE_KEY = 'verdant_logs';

export function getLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addLog(entry) {
  const logs = getLogs();
  logs.push({
    ...entry,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    date: entry.date || new Date().toISOString().slice(0, 10),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  return logs;
}

export function clearLogs() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Group logs by ISO week (Monday-start).
 * Returns array of { weekStart, weekLabel, logs, totals } sorted ascending.
 */
export function getWeeklyLogs(weeks = 6) {
  const logs = getLogs();
  const now = new Date();
  const groups = {};

  logs.forEach((log) => {
    const d = new Date(log.date + 'T00:00:00');
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(d);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    const key = monday.toISOString().slice(0, 10);
    if (!groups[key]) {
      groups[key] = { weekStart: key, logs: [], totals: {} };
    }
    groups[key].logs.push(log);
  });

  // Build last N weeks
  const result = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const m = new Date(now);
    m.setDate(m.getDate() - ((m.getDay() + 6) % 7) - i * 7);
    m.setHours(0, 0, 0, 0);
    const key = m.toISOString().slice(0, 10);
    const group = groups[key] || { weekStart: key, logs: [], totals: {} };
    // Compute category totals
    const totals = { transport: 0, food: 0, energy: 0, shopping: 0 };
    group.logs.forEach((log) => {
      if (log.category && totals[log.category] !== undefined) {
        totals[log.category] += log.co2e || 0;
      }
    });
    group.totals = totals;
    group.total = Object.values(totals).reduce((a, b) => a + b, 0);
    const d = new Date(key + 'T00:00:00');
    const month = d.toLocaleString('en', { month: 'short' });
    const dayNum = d.getDate();
    group.weekLabel = `${month} ${dayNum}`;
    result.push(group);
  }
  return result;
}

export function getCurrentWeekLogs() {
  const weeks = getWeeklyLogs(1);
  return weeks[0] || { weekStart: '', logs: [], totals: {}, total: 0 };
}