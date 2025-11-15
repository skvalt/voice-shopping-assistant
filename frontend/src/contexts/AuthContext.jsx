import { createContext, useContext, useEffect, useState } from "react";
import Api, { getToken, clearToken, setToken } from "../api/Api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [authError, setAuthError] = useState(null);

  // --------------------------------------------------
  // RESTORE USER IF TOKEN EXISTS
  // --------------------------------------------------
  useEffect(() => {
    restoreUser();
  }, []);

  async function restoreUser() {
    const token = getToken();
    if (!token) {
      setLoadingUser(false);
      return;
    }

    try {
      // If backend DOES NOT have /me, fallback to stored user
      const profile = await Api.Auth.getProfile?.();

      if (profile) {
        setUser(profile);
      } else {
        setUser({ username: "local-user" });
      }
    } catch {
      clearToken();
      setUser(null);
    }

    setLoadingUser(false);
  }

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------
  async function login(username, password) {
  try {
    const res = await Api.Auth.login(username, password);

    if (res?.token) setToken(res.token);

    // Now fetch full user profile (must return id / _id)
    const profile = await Api.Auth.getProfile?.();

    if (profile) {
      setUser(profile);
      localStorage.setItem("vsa_user", JSON.stringify(profile));
    } else {
      // fallback: username-only (not ideal but safe)
      setUser({ username });
      localStorage.setItem("vsa_user", JSON.stringify({ username }));
    }

    setAuthError(null);
    return true;
  } catch (err) {
    setAuthError("Invalid username or password");
    return false;
  }
}


  // --------------------------------------------------
  // REGISTER
  // --------------------------------------------------
  async function register(username, email, password) {
    try {
      const res = await Api.Auth.register(username, email, password);

      if (res?.token) setToken(res.token);
      if (res?.user) setUser(res.user);
      else setUser({ username, email });

      setAuthError(null);
      return true;
    } catch (err) {
      setAuthError(err.message || "Registration failed");
      return false;
    }
  }

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------
  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loadingUser,
        authError,
        setAuthError,
        login,
        register,
        logout,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// --------------------------------------------------
// HOOK EXPORT (required by AppLayout, Home etc.)
// --------------------------------------------------
export function useAuth() {
  return useContext(AuthContext);
}
