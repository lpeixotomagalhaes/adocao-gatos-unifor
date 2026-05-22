export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiUrl = (path) => `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;

export const buildMediaUrl = (foto) => {
  if (!foto) return '';
  if (foto.startsWith('http://') || foto.startsWith('https://')) return foto;
  return `${API_URL}${foto.startsWith('/') ? '' : '/'}${foto}`;
};

const authHeaders = () => {
  const token = localStorage.getItem('tokenAdmin');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiFetch = (path, options = {}) => {
  const isForm = options.body instanceof FormData;
  return fetch(apiUrl(path), {
    ...options,
    headers: {
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
};
