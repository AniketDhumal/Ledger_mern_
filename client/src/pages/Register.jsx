import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [income, setIncome] = useState("");
  const [budget, setBudget] = useState("");

  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    // 🔥 Validation
    if (!name || !email || !password) {
      setErr("All fields are required");
      return;
    }

    if (!income) {
      setErr("Please enter your monthly income");
      return;
    }

    setLoading(true);

    try {
      await registerUser(
        name,
        email,
        password,
        Number(income),
        Number(budget)
      );

      setOk("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        nav("/login", { replace: true });
      }, 800);

    } catch (ex) {
      setErr(ex?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4">Register</h2>

      <form onSubmit={onSubmit} className="space-y-3">

        {/* Name */}
        <input
          className="border p-2 w-full"
          placeholder="Name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <input
          className="border p-2 w-full"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          className="border p-2 w-full"
          placeholder="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Income */}
        <input
          className="border p-2 w-full"
          placeholder="Monthly Income (₹)"
          type="number"
          value={income}
          onChange={(e) => {
            setIncome(e.target.value);

            // 🔥 Auto-suggest budget (70% of income)
            if (!budget) {
              setBudget(Math.floor(e.target.value * 0.7));
            }
          }}
        />

        {/* Budget */}
        <input
          className="border p-2 w-full"
          placeholder="Monthly Budget (₹)"
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        {/* Errors */}
        {err && <p className="text-sm text-red-600">{err}</p>}
        {ok && <p className="text-sm text-green-600">{ok}</p>}

        {/* Submit */}
        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 w-full disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      {/* Login Link */}
      <p className="text-sm mt-3">
        Have an account?{" "}
        <Link className="underline" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}

