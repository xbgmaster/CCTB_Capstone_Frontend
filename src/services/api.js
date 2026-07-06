// Thin fetch wrapper that handles:
//   - Base URL (configurable via VITE_API_BASE_URL)
//   - Bearer JWT injected from localStorage
//   - JSON serialization / parsing
//   - Uniform error shape (throws ApiError with .status and .body)

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5080/api'
).replace(/\/+$/, '');

const TOKEN_KEY = 'jobnet.token.v1';

export const auth = {
  getToken() {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  },
  setToken(token) {
    try { token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
  },
  clearToken() {
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
  },
};

export class ApiError extends Error {
  constructor(status, message, body) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function request(method, path, { body, query, headers } = {}) {
  const url = new URL(`${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '') continue;
      url.searchParams.append(k, String(v));
    }
  }

  const init = {
    method,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(headers || {}),
    },
  };
  const token = auth.getToken();
  if (token) init.headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) init.body = JSON.stringify(body);

  let response;
  try {
    response = await fetch(url.toString(), init);
  } catch (err) {
    throw new ApiError(0, 'Network error: cannot reach the API server.', { cause: err.message });
  }

  if (response.status === 204) return null;

  const text = await response.text();
  let payload = null;
  if (text) {
    try { payload = JSON.parse(text); } catch { payload = text; }
  }

  if (!response.ok) {
    const detail = (payload && typeof payload === 'object' && (payload.detail || payload.title)) || response.statusText;
    throw new ApiError(response.status, detail, payload);
  }
  return payload;
}

export const api = {
  get:    (path, opts)      => request('GET',    path, opts),
  post:   (path, body, opts)=> request('POST',   path, { ...opts, body }),
  put:    (path, body, opts)=> request('PUT',    path, { ...opts, body }),
  patch:  (path, body, opts)=> request('PATCH',  path, { ...opts, body }),
  delete: (path, opts)      => request('DELETE', path, opts),
};
