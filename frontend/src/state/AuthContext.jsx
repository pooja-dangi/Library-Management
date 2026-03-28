import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { http } from "../api/http";

const AuthContext = createContext(null);

const LS_KEY = "lms_auth";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const token = auth?.token || null;

  useEffect(() => {
    if (auth) localStorage.setItem(LS_KEY, JSON.stringify(auth));
    else localStorage.removeItem(LS_KEY);
  }, [auth]);

  const login = async ({ userId, password }) => {
    const { data } = await http.post("/auth/login", { userId, password });
    setAuth(data);
    return data;
  };

  const logout = () => setAuth(null);

  const value = useMemo(
    () => ({
      auth,
      token,
      user: auth
        ? { _id: auth._id, name: auth.name, userId: auth.userId, role: auth.role, isActive: auth.isActive }
        : null,
      isAuthenticated: !!token,
      login,
      logout,
      setAuth,
    }),
    [auth, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

