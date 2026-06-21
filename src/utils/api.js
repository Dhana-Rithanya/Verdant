const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken() {
  return localStorage.getItem('verdant_token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }

  return res.json();
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email, name, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ email, name, password }) }),
  getMe: () => request('/auth/me'),

  // Activities
  getActivities: (weeks = 52) => request(`/activities?weeks=${weeks}`),
  createActivity: (data) =>
    request('/activities', { method: 'POST', body: JSON.stringify(data) }),
  deleteActivity: (id) =>
    request(`/activities/${id}`, { method: 'DELETE' }),
  getWeekly: (weeks = 6) => request(`/activities/weekly?weeks=${weeks}`),
};