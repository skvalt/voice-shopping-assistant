import { Link, useNavigate } from "react-router-dom";
import useAuthForm from "../../hooks/useAuthForm";

export default function Login() {
  const navigate = useNavigate();

  const {
    form,
    loading,
    localError,
    authError,
    updateField,
    handleLogin,
  } = useAuthForm("login");

  async function submit(e) {
    e.preventDefault();
    const ok = await handleLogin();
    if (ok) navigate("/home");
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 bg-gradient-to-br from-indigo-500 to-indigo-700">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm mx-auto">

        <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Welcome Back
        </h1>

        <form onSubmit={submit} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border rounded-lg bg-gray-50 text-sm"
            value={form.username}
            onChange={(e) => updateField("username", e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg bg-gray-50 text-sm"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
          />

          {(localError || authError) && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {localError || authError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg text-sm active:scale-95"
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-medium">
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}
