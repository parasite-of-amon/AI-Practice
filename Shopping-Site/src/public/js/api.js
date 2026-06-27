const BASE = '/api';

function getSessionId() {
  let sid = localStorage.getItem('stylehub-session');
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem('stylehub-session', sid);
  }
  return sid;
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Session-ID': getSessionId(),
      ...options.headers,
    },
    ...options,
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
  return body.data;
}

export const api = {
  get:    (path)       => apiFetch(path),
  post:   (path, data) => apiFetch(path, { method: 'POST',   body: JSON.stringify(data) }),
  put:    (path, data) => apiFetch(path, { method: 'PUT',    body: JSON.stringify(data) }),
  delete: (path)       => apiFetch(path, { method: 'DELETE' }),
};
