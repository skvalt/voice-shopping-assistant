import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

/**
 * useAuth
 * -----------------------------------------
 * Provides direct access to AuthContext.
 * Example:
 *   const { user, token, login, logout } = useAuth();
 */
export function useAuth() {
  return useContext(AuthContext);
}
