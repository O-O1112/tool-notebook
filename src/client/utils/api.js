const RAW_API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE) || '/api';
const API_BASE = RAW_API_BASE.replace(/\/+$/, '');

export function getAuthToken() {
  return localStorage.getItem('class_notebook_token') || '';
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('class_notebook_token', token);
  } else {
    localStorage.removeItem('class_notebook_token');
  }
}

export async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || `請求失敗 (狀態碼: ${response.status})`;
    const error = new Error(errorMsg);
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  // 身分認證
  login: (username, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me'),

  // 空間管理
  getSpaces: () => request('/spaces'),
  createSpace: (payload) => request('/spaces', { method: 'POST', body: JSON.stringify(payload) }),
  joinSpace: (inviteCode) => request('/spaces/join', { method: 'POST', body: JSON.stringify({ inviteCode }) }),
  getSpaceByShareCode: (code) => request(`/spaces/share/${encodeURIComponent(code)}`),
  regenerateInviteCode: (spaceId) => request(`/spaces/${spaceId}/regenerate-code`, { method: 'POST' }),
  getSpaceDetail: (id) => request(`/spaces/${id}`),
  updateSpace: (id, payload) => request(`/spaces/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteSpace: (id) => request(`/spaces/${id}`, { method: 'DELETE' }),

  // 工具管理與靈活操作
  addTool: (spaceId, payload) => request(`/spaces/${spaceId}/tools`, { method: 'POST', body: JSON.stringify(payload) }),
  updateTool: (spaceId, toolId, payload) => request(`/spaces/${spaceId}/tools/${toolId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  reorderTools: (spaceId, toolIds) => request(`/spaces/${spaceId}/tools/reorder`, { method: 'PATCH', body: JSON.stringify({ toolIds }) }),
  deleteTool: (spaceId, toolId) => request(`/spaces/${spaceId}/tools/${toolId}`, { method: 'DELETE' }),
};
