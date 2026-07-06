import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ROLES } from '../data/seed.js';
import { ApiError, auth as tokenStore } from '../services/api.js';
import { authApi } from '../services/endpoints.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  // On first mount: if we have a saved JWT, fetch /auth/me to rehydrate
  // currentUser. If the token is stale or rejected, drop it silently.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!tokenStore.getToken()) {
        setBootstrapping(false);
        return;
      }
      try {
        const me = await authApi.me();
        if (!cancelled) setCurrentUser(me);
      } catch (err) {
        tokenStore.clearToken();
        if (!cancelled) setCurrentUser(null);
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { token, user } = await authApi.login(email, password);
      tokenStore.setToken(token);
      setCurrentUser(user);
      return { ok: true, user };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Unable to reach the server.';
      return { ok: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    tokenStore.clearToken();
    setCurrentUser(null);
  }, []);

  const register = useCallback(async (payload) => {
    try {
      const { token, user } = await authApi.register(payload);
      tokenStore.setToken(token);
      setCurrentUser(user);
      return { ok: true, user };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Unable to reach the server.';
      return { ok: false, error: message };
    }
  }, []);

  /**
   * Re-fetch the current user from the server. Useful after any mutation
   * that might change profile fields, role assignments, or company linkage.
   */
  const refreshMe = useCallback(async () => {
    if (!tokenStore.getToken()) return;
    try {
      const me = await authApi.me();
      setCurrentUser(me);
    } catch {
      // ignore - the token might have expired between calls
    }
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: !!currentUser,
      bootstrapping,
      ROLES,
      login,
      logout,
      register,
      refreshMe,
    }),
    [currentUser, bootstrapping, login, logout, register, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
