import { Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Landing from "./pages/Landing";

function useAuth() {
  const [isAuthed, setIsAuthed] = useState(false);
  useEffect(() => {
    const checkAuth = () => setIsAuthed(!!localStorage.getItem("token"));
    checkAuth();
    window.addEventListener("storage", checkAuth);
    const handleAuthChange = () => checkAuth();
    window.addEventListener("authChange", handleAuthChange);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);
  return isAuthed;
}

function Shell({ children, isAuthed }) {
  const nav = useNavigate();
  const out = () => {
    localStorage.removeItem("token");
    try { localStorage.removeItem("user"); } catch { }
    window.dispatchEvent(new Event("authChange"));
    nav("/", { replace: true });
  };

  let userEmail = "";
  try { userEmail = JSON.parse(localStorage.getItem("user") || "null")?.email || ""; } catch { }

  return (
    <div className="min-h-screen ">
      <header className="bg-[#0b1220] border-b border-[#1f2a44] text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="font-semibold">Ledgerlite</h1>
            {isAuthed && (
              <nav className="flex items-center gap-2 text-sm">
                <Link
                  className="text-[#93c5fd] hover:text-white underline underline-offset-2"
                  to="/dashboard"
                >
                  Dashboard
                </Link>
                <span className="text-slate-400">·</span>
                <Link
                  className="text-[#93c5fd] hover:text-white underline underline-offset-2"
                  to="/analytics"
                >
                  Analytics
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3">
            {userEmail && <span className="text-xs text-slate-300">{userEmail}</span>}
            <span className="text-xs text-slate-400">
              API: <code className="text-slate-200">{import.meta.env.VITE_API_BASE}</code>
            </span>
            {isAuthed && (
              <button
                onClick={out}
                className="border border-[#334155] px-3 py-1 text-sm rounded-md hover:bg-[#0f172a]"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>


      <main className="p-4">{children}</main>
    </div>
  );
}

export default function App() {
  const isAuthed = useAuth();

  return (
    <Routes>
      {/* Public landing */}
      <Route
        path="/"
        element={isAuthed ? <Navigate to="/dashboard" replace /> : <Landing />}
      />

      {/* Auth pages */}
      <Route
        path="/login"
        element={isAuthed ? <Navigate to="/dashboard" replace /> : <Shell isAuthed={isAuthed}><Login /></Shell>}
      />
      <Route
        path="/register"
        element={isAuthed ? <Navigate to="/dashboard" replace /> : <Shell isAuthed={isAuthed}><Register /></Shell>}
      />

      {/* Protected pages */}
      <Route
        path="/dashboard"
        element={isAuthed ? <Shell isAuthed={isAuthed}><Dashboard /></Shell> : <Navigate to="/login" replace />}
      />
      <Route
        path="/analytics"
        element={isAuthed ? <Shell isAuthed={isAuthed}><Analytics /></Shell> : <Navigate to="/login" replace />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
