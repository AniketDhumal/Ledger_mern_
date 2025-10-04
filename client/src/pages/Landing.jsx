import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f172a] border border-[#1f2a44] text-sm mb-4">
          <span>💸</span> <span>Ledgerlite • MERN Expense Manager</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Take Control of Your Spending
        </h1>
        <p className="mt-4 text-slate-300 max-w-3xl mx-auto">
          Track expenses, filter what matters, and see trends instantly.
          A fast, minimalist expense manager built with Node, MongoDB, and React.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link to="/login" className="rounded-md px-5 py-3 bg-[#3b82f6] hover:bg-[#2563eb] transition">
            Get Started
          </Link>
          <Link to="/register" className="rounded-md px-5 py-3 border border-[#334155] hover:bg-[#0f172a]/70">
            Create Account
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<SvgShield />}
            title="Secure Auth (JWT)"
            desc="Register & login with hashed passwords and token-based access."
          />
          <FeatureCard
            icon={<SvgBolt />}
            title="Fast CRUD"
            desc="Add, list, and delete expenses with instant UI updates."
          />
          <FeatureCard
            icon={<SvgFilter />}
            title="Filters & Search"
            desc="Search titles, filter by category, reimbursable, and date range."
          />
          <FeatureCard
            icon={<SvgChart />}
            title="Analytics"
            desc="Visualize spend over time, by category, and reimbursement split."
          />
          <FeatureCard
            icon={<SvgCloud />}
            title="MongoDB Atlas"
            desc="Reliable cloud database with Mongoose models and validation."
          />
          <FeatureCard
            icon={<SvgSparkles />}
            title="Minimal & Snappy"
            desc="Clean UI, Tailwind styling, React Query for smooth fetches."
          />
        </div>
      </section>

      {/* Footer-ish */}
      <section className="text-center text-slate-400 text-sm pb-8">
        Built for clarity & speed • API: <code>{import.meta.env.VITE_API_BASE}</code>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-[#0f172a] border border-[#1f2a44] rounded-xl p-5">
      <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#111a2e] border border-[#1f2a44] mb-3">
        {icon}
      </div>
      <div className="font-semibold">{title}</div>
      <div className="text-slate-300 text-sm mt-1">{desc}</div>
    </div>
  );
}

/* ---- tiny inline icons (no extra libs) ---- */
function SvgShield() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#93c5fd]"><path fill="currentColor" d="M12 2l7 3v6c0 5-3.5 9.3-7 11-3.5-1.7-7-6-7-11V5l7-3z"/></svg>
  );
}
function SvgBolt() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#60a5fa]"><path fill="currentColor" d="M11 21l1-7H8l7-11-1 7h4l-7 11z"/></svg>
  );
}
function SvgFilter() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#7dd3fc]"><path fill="currentColor" d="M3 5h18l-7 8v6l-4-2v-4L3 5z"/></svg>
  );
}
function SvgChart() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#34d399]"><path fill="currentColor" d="M3 13h4v8H3v-8zm7-6h4v14h-4V7zm7-4h4v18h-4V3z"/></svg>
  );
}
function SvgCloud() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#86efac]"><path fill="currentColor" d="M6 19h11a4 4 0 100-8 6 6 0 10-11 3 3 3 0 000 5z"/></svg>
  );
}
function SvgSparkles() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#fbbf24]"><path fill="currentColor" d="M12 2l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5zm7 11l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zM3 11l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"/></svg>
  );
}
