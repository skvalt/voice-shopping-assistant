import { useState } from "react";
import { useAuth } from "./useAuth";

/**
 * useAuthForm
 * -----------------------------------------
 * Handles:
 *  - username/password for login
 *  - username/email/password for register
 *  - form state
 *  - local + auth errors
 */

export default function useAuthForm(type = "login") {
  const { login, register, authError, setAuthError } = useAuth();

  // unified form state
  const [form, setForm] = useState({
    username: "",   // used for login + register
    email: "",      // used only for register
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // update form fields
  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // -----------------------------------------
  // LOGIN (username + password)
  // -----------------------------------------
  async function handleLogin() {
    setLocalError(null);
    setAuthError(null);

    if (!form.username || !form.password) {
      setLocalError("Username and password are required");
      return false;
    }

    const ok = await login(form.username, form.password);
    return ok;
  }

  // -----------------------------------------
  // REGISTER (username + email + password)
  // -----------------------------------------
  async function handleRegister() {
    setLocalError(null);
    setAuthError(null);
    setLoading(true);

    if (!form.username || !form.email || !form.password) {
      setLocalError("All fields are required");
      setLoading(false);
      return false;
    }

    const ok = await register(form.username, form.email, form.password);
    setLoading(false);
    return ok;
  }

  return {
    form,
    loading,
    localError,
    authError,
    updateField,
    handleLogin,
    handleRegister,
  };
}
