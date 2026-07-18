const API_URL = import.meta.env.VITE_API_URL || 'https://portfolio-web-5x6a.vercel.app/api';
const TOKEN_KEY = 'portfolio_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  let response;
  const token = getToken();

  try {
    response = await fetch(`${API_URL}${path}`, {
      credentials: 'include',
      ...options,
      headers: {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error('Cannot reach server. Make sure backend is running on port 5000.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const api = {
  getProjects: () => request('/projects'),
  getAdminProjects: () => request('/projects/admin/all'),
  createProject: (formData) =>
    request('/projects', {
      method: 'POST',
      body: formData,
    }),
  updateProject: (id, formData) =>
    request(`/projects/${id}`, {
      method: 'PUT',
      body: formData,
    }),
  deleteProject: (id) =>
    request(`/projects/${id}`, {
      method: 'DELETE',
    }),
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
};

export default api;
