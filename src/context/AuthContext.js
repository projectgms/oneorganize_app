import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const DUMMY_USER = {
  id: "u1",
  name: "Vineet",
  email: "test@example.com",
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // for mock password reset flow
  const [resetToken, setResetToken] = useState(null);

  const login = async ({ email, password }) => {
    // Dummy credentials
    if (email?.toLowerCase() === "test@example.com" && password === "123456") {
      setToken("dummy_access_token");
      setUser(DUMMY_USER);
      return { ok: true };
    }
    return { ok: false, message: "Invalid email or password (try test@example.com / 123456)" };
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
  };

  const requestPasswordReset = async (email) => {
    // pretend we emailed a token
    const t = "RESET-1234";
    setResetToken(t);
    return { ok: true, token: t, email };
  };

  const resetPassword = async ({ email, token: t, newPassword }) => {
    if (!email || !t || !newPassword) return { ok: false, message: "Missing fields" };
    if (t !== resetToken) return { ok: false, message: "Invalid reset token (use RESET-1234)" };
    // success, clear token
    setResetToken(null);
    return { ok: true };
  };

  const changePassword = async ({ oldPassword, newPassword }) => {
    // dummy: old password must be 123456
    if (oldPassword !== "123456") return { ok: false, message: "Old password is incorrect (try 123456)" };
    if (!newPassword || newPassword.length < 6) return { ok: false, message: "New password must be 6+ chars" };
    return { ok: true };
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      requestPasswordReset,
      resetPassword,
      changePassword,
    }),
    [token, user, resetToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
