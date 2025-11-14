import { createContext, useEffect, useState } from "react";
import Api, { getToken, clearToken } from "../api/Api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [authError, setAuthError] = useState(null);

  // --------------------------------------------------
  // Load user if token exists
  // --------------------------------------------------
  useEffect(() => {
    const token = getToken();

    if (!token) {
      setLoadingUser(false);
      return;
    }

    // Until backend provides /me, fallback
    setUser({ username: "local-user" });
    setLoadingUser(false);
  }, []);

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------
  async function login(username, password) {
  try {
    const res = await Api.Auth.login(username, password);

    setUser(res.user || { username });
    setAuthError(null);
    setLoadingUser(false);   // FIX HERE
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

      setUser(res.user || { username, email });
      setAuthError(null);
      setLoadingUser(false); 
      return true;
    } catch (err) {
      setAuthError(err.message);
      return false;
    }
  }

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------
  function logout() {
    Api.Auth.logout();
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
