/**
 * Unified API Client for Early Warning System
 * Handles authentication headers, error normalization, and endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'edusignal_jwt_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request(endpoint, options = {}) {
  const token = tokenStorage.get();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // If unauthorized (401), token might have expired
    if (error.status === 401 && token) {
      console.warn('[API Client] Unauthorized request, session may have expired.');
    }
    throw error;
  }
}

export const api = {
  // System Health
  health: () => request('/health'),

  // Authentication
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
    getMe: () => request('/auth/me'),
    logout: () => request('/auth/logout', { method: 'POST' }),
  },

  // Students
  students: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.department && params.department !== 'ALL') query.append('department', params.department);
      if (params.riskLevel && params.riskLevel !== 'ALL') query.append('riskLevel', params.riskLevel);
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request(`/students${qs}`);
    },
    getById: (id) => request(`/students/${id}`),
    getMe: () => request('/students/me'),
    getRisk: (id) => request(`/students/${id}/risk`),
    update: (id, updates) => request(`/students/${id}`, { method: 'PATCH', body: updates }),
  },

  // Interventions
  interventions: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.studentId) query.append('studentId', params.studentId);
      if (params.status && params.status !== 'ALL') query.append('status', params.status);
      if (params.mentorId && params.mentorId !== 'ALL') query.append('mentorId', params.mentorId);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request(`/interventions${qs}`);
    },
    create: (data) => request('/interventions', { method: 'POST', body: data }),
    update: (id, updates) => request(`/interventions/${id}`, { method: 'PATCH', body: updates }),
  },

  // Student Support Requests
  support: {
    create: (data) => request('/support-requests', { method: 'POST', body: data }),
    getMe: () => request('/support-requests/me'),
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.status && params.status !== 'ALL') query.append('status', params.status);
      if (params.studentId) query.append('studentId', params.studentId);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request(`/support-requests${qs}`);
    },
    update: (id, updates) => request(`/support-requests/${id}`, { method: 'PATCH', body: updates }),
  },
};

export default api;
