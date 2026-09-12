import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, getAuthToken } from '../utils/api';

const AuthContext = createContext(null);

const normalizeUser = (rawUser) => {
  if (!rawUser) return null;
  const name = rawUser.displayName || rawUser.display_name || rawUser.username || '同學';
  return {
    ...rawUser,
    displayName: name,
    display_name: name,
  };
};

export function AuthProvider({ children }) {
  // 從 localStorage 預載快取的使用者資訊，防止重新整理或啟動時瞬間空白或回退為「同學」
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('class_notebook_user');
      return cached ? normalizeUser(JSON.parse(cached)) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        setUser(null);
        localStorage.removeItem('class_notebook_user');
        return;
      }

      try {
        const data = await api.getMe();
        if (data?.user) {
          const normalized = normalizeUser(data.user);
          setUser(normalized);
          localStorage.setItem('class_notebook_user', JSON.stringify(normalized));
        } else {
          throw new Error('無效的使用者資料');
        }
      } catch (err) {
        console.warn('憑證失效或使用者不存在，清除憑證');
        setAuthToken(null);
        setUser(null);
        localStorage.removeItem('class_notebook_user');
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (username, password) => {
    const data = await api.login(username, password);
    const normalized = normalizeUser(data.user);
    setAuthToken(data.token);
    setUser(normalized);
    localStorage.setItem('class_notebook_user', JSON.stringify(normalized));
    return normalized;
  };

  const register = async (payload) => {
    const data = await api.register(payload);
    const normalized = normalizeUser(data.user);
    setAuthToken(data.token);
    setUser(normalized);
    localStorage.setItem('class_notebook_user', JSON.stringify(normalized));
    return normalized;
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('class_notebook_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
