const API_BASE = '/api';

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

const api = {
  get: (endpoint) => fetch(`${API_BASE}${endpoint}`).then(handleResponse),

  post: (endpoint, data) =>
    fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  put: (endpoint, data = {}) =>
    fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  delete: (endpoint) =>
    fetch(`${API_BASE}${endpoint}`, { method: 'DELETE' }).then(handleResponse),
};

export default api;
