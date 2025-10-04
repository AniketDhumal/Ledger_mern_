import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const canSubmit = email.trim() !== "" && password.trim() !== "" && !loading;

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setErr("");
    setLoading(true);
    try {
      const { token, user } = await login(email.trim(), password);
      // persist auth
      localStorage.setItem("token", token);
      if (user) {
        try { localStorage.setItem("user", JSON.stringify(user)); } catch {}
      }
      // notify app-wide listeners that auth changed (your requirement)
      window.dispatchEvent(new Event("authChange"));
      // go to dashboard
      nav("/dashboard", { replace: true });
    } catch (ex) {
      const msg =
        ex?.response?.data?.error ||
        ex?.response?.data?.message ||
        ex?.message ||
        "Login failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-2">Login</h1>

        {/* tiny debug banner (only in dev) */}
        {import.meta.env.DEV && (
          <div className="mb-3 text-xs text-gray-600">
            API: <code>{import.meta.env.VITE_API_BASE || "(missing VITE_API_BASE)"}</code>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block">
            <span className="text-sm text-gray-700">Email</span>
            <input
              className="mt-1 border p-2 w-full rounded-md"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Password</span>
            <div className="mt-1 flex">
              <input
                className="border p-2 w-full rounded-l-md"
                placeholder="••••••••"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="border border-l-0 px-3 rounded-r-md text-sm"
                title={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="bg-black text-white px-4 py-2 w-full rounded-md disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-sm mt-3">
          No account?{" "}
          <Link className="underline" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
