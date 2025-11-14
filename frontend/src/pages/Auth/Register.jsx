import { Link, useNavigate } from "react-router-dom";
import useAuthForm from "../../hooks/useAuthForm";

export default function Register() {
  const navigate = useNavigate();

  const {
    form,
    loading,
    localError,
    authError,
    updateField,
    handleRegister,
  } = useAuthForm("register");

  async function submit(e) {
    e.preventDefault();
    const ok = await handleRegister();
    if (ok) navigate("/home");   // FIXED redirect
  }

  return (
    <div className="pt-8">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Create Account
      </h1>

      <form onSubmit={submit} className="flex flex-col gap-4">

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 border rounded-lg bg-gray-50 text-sm"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg bg-gray-50 text-sm"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
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
          {loading ? "Creating account…" : "Register"}
        </button>

      </form>

      <div className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 font-medium">
          Login
        </Link>
      </div>
    </div>
  );
}
