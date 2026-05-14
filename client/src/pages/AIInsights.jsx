import { useEffect, useState, useCallback } from "react";
import { getAIInsights } from "../api/expenses";

export default function AIInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 Fetch insights
  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const income = 50000;

      const res = await getAIInsights(income);

      const cleaned = (res.insights || []).map((i) => ({
        type: i.type || "info",
        message: i.message || "No insight available",
        metric: i.metric || null,
        value: i.value ?? null,
      }));

      const priority = {
        warning: 1,
        tip: 2,
        insight: 3,
        good: 4,
        info: 5,
      };

      cleaned.sort(
        (a, b) => (priority[a.type] || 99) - (priority[b.type] || 99)
      );

      setInsights(cleaned);

    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to load insights. Try again.");
      }

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  // 🔥 Group insights
  function groupInsights(data) {
    return {
      warning: data.filter(i => i.type === "warning"),
      tip: data.filter(i => i.type === "tip"),
      insight: data.filter(i => i.type === "insight"),
      good: data.filter(i => i.type === "good"),
    };
  }

  const grouped = groupInsights(insights);

  // 🎨 Styles
  function getStyle(type) {
    switch (type) {
      case "warning":
        return { bg: "bg-red-50", icon: "⚠️" };
      case "good":
        return { bg: "bg-green-50", icon: "✅" };
      case "tip":
        return { bg: "bg-yellow-50", icon: "💡" };
      case "insight":
        return { bg: "bg-purple-50", icon: "📊" };
      default:
        return { bg: "bg-blue-50", icon: "ℹ️" };
    }
  }

  // 🔥 Card component
  function InsightCard({ i }) {
    const style = getStyle(i.type);

    return (
      <div className={`p-4 rounded-xl shadow-sm ${style.bg}`}>
        <div className="flex items-center justify-between">
          <span className="font-medium">
            {style.icon} {i.message}
          </span>
        </div>

        {/* 🔥 Progress bar (if % value) */}
        {typeof i.value === "number" && i.value <= 100 && (
          <div className="mt-3">
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-black rounded"
                style={{ width: `${i.value}%` }}
              />
            </div>
          </div>
        )}

        {/* Metric */}
        {i.metric && (
          <div className="text-xs text-gray-500 mt-2">
            {i.metric}
          </div>
        )}
      </div>
    );
  }

  // 🔥 Section wrapper
  function Section({ title, items }) {
    if (!items.length) return null;

    return (
      <div className="mb-5">
        <h3 className="text-sm font-semibold mb-2 text-gray-600">
          {title}
        </h3>
        <div className="space-y-2">
          {items.map((i, idx) => (
            <InsightCard key={idx} i={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">🧠 Smart Insights</h2>

        <button
          onClick={fetchInsights}
          className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="text-center text-red-500 mb-3">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500 animate-pulse">
          🤖 Analyzing your spending patterns...
        </div>
      )}

      {/* Empty */}
      {!loading && !error && insights.length === 0 && (
        <div className="text-center text-gray-400">
          No insights yet. Add more expenses to see analysis.
        </div>
      )}

      {/* 🔥 TOP INSIGHT (Highlight) */}
      {!loading && insights.length > 0 && (
        <div className="bg-black text-white p-4 rounded-xl mb-4 shadow">
          <h3 className="text-sm opacity-70">Top Insight</h3>
          <p className="text-lg font-semibold mt-1">
            {insights[0].message}
          </p>
        </div>
      )}

      {/* 🔥 GROUPED INSIGHTS */}
      <Section title="⚠️ Risks" items={grouped.warning} />
      <Section title="💡 Smart Tips" items={grouped.tip} />
      <Section title="📊 Spending Patterns" items={grouped.insight} />
      <Section title="✅ Good Habits" items={grouped.good} />

    </div>
  );
}