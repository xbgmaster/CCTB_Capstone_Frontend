// One function per backend endpoint. Keeping these centralized makes the
// DataContext / AuthContext logic easy to read AND makes it trivial to
// stub these out in tests later.

import { api } from './api.js';

// ---------- Auth ----------
export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login:    (email, password) => api.post('/auth/login', { email, password }),
  me:       () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
};

// ---------- Users (admin) ----------
export const usersApi = {
  list:        (params = {}) => api.get('/users', { query: params }),
  get:         (id)          => api.get(`/users/${id}`),
  setStatus:   (id, status)  => api.patch(`/users/${id}/status`, { status }),
};

// ---------- Companies ----------
export const companiesApi = {
  list:    (query)       => api.get('/companies', { query: { query } }),
  get:     (id)          => api.get(`/companies/${id}`),
  update:  (id, payload) => api.put(`/companies/${id}`, payload),
  verify:  (id, verified)=> api.patch(`/companies/${id}/verify`, { verified }),
};

// ---------- Worker profiles ----------
export const workersApi = {
  get:        (userId)   => api.get(`/workers/${userId}`),
  getMe:      ()         => api.get('/workers/me'),
  upsertMe:   (payload)  => api.put('/workers/me', payload),
};

// ---------- Jobs ----------
export const jobsApi = {
  list:           (filter = {}) => api.get('/jobs', { query: filter }),
  get:            (id)          => api.get(`/jobs/${id}`),
  create:         (payload)     => api.post('/jobs', payload),
  update:         (id, payload) => api.put(`/jobs/${id}`, payload),
  changeStatus:   (id, status)  => api.patch(`/jobs/${id}/status`, { status }),
  remove:         (id)          => api.delete(`/jobs/${id}`),
  applications:   (id)          => api.get(`/jobs/${id}/applications`),
};

// ---------- Applications ----------
export const applicationsApi = {
  apply:         (payload)     => api.post('/applications', payload),
  mine:          ()            => api.get('/applications/me'),
  changeStatus:  (id, status)  => api.patch(`/applications/${id}/status`, { status }),
};

// ---------- Reviews ----------
export const reviewsApi = {
  create:           (payload)    => api.post('/reviews', payload),
  forCompany:       (companyId)  => api.get('/reviews', { query: { toCompanyId: companyId } }),
  forUser:          (userId)     => api.get('/reviews', { query: { toUserId: userId } }),
  authoredBy:       (userId)     => api.get('/reviews', { query: { authoredBy: userId } }),
};

// ---------- Notifications ----------
export const notificationsApi = {
  mine:        ()    => api.get('/notifications/me'),
  markRead:    (id)  => api.patch(`/notifications/${id}/read`),
  markAllRead: ()    => api.post('/notifications/me/read-all'),
};

// ---------- Admin ----------
export const adminApi = {
  overview: () => api.get('/admin/overview'),
  funnel:   () => api.get('/admin/reports/funnel'),
  seed:     () => api.post('/admin/seed'),
  reset:    () => api.post('/admin/reset'),
};
