import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listExpenses } from "../api/expenses";
// optional helpers if you created them earlier
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";

import {
    LineChart, Line,
    BarChart, Bar,
    PieChart, Pie, Cell,
    Tooltip, Legend, XAxis, YAxis,
    CartesianGrid, ResponsiveContainer,
} from "recharts";

const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

function dayKey(isoOrDate) {
    const d = new Date(isoOrDate);
    if (isNaN(d)) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
}

const PIE_COLORS = ["#16a34a", "#ef4444"];

export default function Analytics() {
    // date range (default: this month)
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    useEffect(() => {
        // default to current month once on mount
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth();
        const pad = (n) => String(n).padStart(2, "0");
        const last = new Date(y, m + 1, 0).getDate();
        setFromDate(`${y}-${pad(m + 1)}-01`);
        setToDate(`${y}-${pad(m + 1)}-${pad(last)}`);
    }, []);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["analytics", { fromDate, toDate }],
        queryFn: () =>
            listExpenses({
                page: 1,
                limit: 1000,        // pull enough for charts
                sort: "createdAt",  // oldest -> newest for nicer lines
                from: fromDate || undefined,
                to: toDate || undefined,
            }),
        enabled: !!fromDate && !!toDate,
        keepPreviousData: true,
    });

    const items = data?.items ?? [];

    // ---- Aggregations ----
    const byDay = useMemo(() => {
        const map = new Map();
        for (const e of items) {
            const k = dayKey(e.createdAt);
            const v = (Number(e.total) || 0) + (map.get(k) || 0);
            map.set(k, v);
        }
        return Array.from(map.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, total]) => ({ date, total }));
    }, [items]);

    const byCategory = useMemo(() => {
        const map = new Map();
        for (const e of items) {
            const k = e.category || "Other";
            const v = (Number(e.total) || 0) + (map.get(k) || 0);
            map.set(k, v);
        }
        return Array.from(map.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([category, total]) => ({ category, total }));
    }, [items]);

    const reimbSplit = useMemo(() => {
        let reimb = 0, non = 0;
        for (const e of items) {
            const val = Number(e.total) || 0;
            if (e.reimbursable) reimb += val;
            else non += val;
        }
        return [
            { name: "Reimbursable", value: reimb },
            { name: "Non-reimbursable", value: non },
        ];
    }, [items]);

    const periodTotal = items.reduce((s, e) => s + (Number(e.total) || 0), 0);

    // ---- UI ----
    return (
        <div className="max-w-6xl mx-auto space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold">Analytics</h2>
                    <div className="text-sm text-gray-600">
                        Range: <strong>{fromDate || "—"}</strong> → <strong>{toDate || "—"}</strong> ·{" "}
                        {items.length} items · Total {INR.format(periodTotal)}
                    </div>
                </div>

                {/* Date controls */}
                <div className="flex flex-wrap gap-2">
                    <input
                        type="date"
                        className="border p-2 rounded-md"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        title="From date"
                    />
                    <input
                        type="date"
                        className="border p-2 rounded-md"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        title="To date"
                    />
                    <button
                        className="border px-3 py-2 rounded-md"
                        onClick={() => {
                            const now = new Date();
                            const y = now.getFullYear();
                            const m = now.getMonth();
                            const pad = (n) => String(n).padStart(2, "0");
                            const last = new Date(y, m + 1, 0).getDate();
                            setFromDate(`${y}-${pad(m + 1)}-01`);
                            setToDate(`${y}-${pad(m + 1)}-${pad(last)}`);
                        }}
                    >
                        This month
                    </button>
                    <button
                        className="border px-3 py-2 rounded-md"
                        onClick={() => { setFromDate(""); setToDate(""); }}
                    >
                        Clear dates
                    </button>
                </div>
            </div>

            {/* Charts */}
            {isLoading && <Spinner label="Loading charts…" />}
            {isError && !isLoading && (
                <div className="text-red-600 text-sm">Failed to load analytics.</div>
            )}
            {!isLoading && items.length === 0 && (
                <EmptyState title="No data for this period">Try adjusting the dates.</EmptyState>
            )}

            {!isLoading && items.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Spend over time */}
                    <div className="border rounded-xl p-3">
                        <div className="font-medium mb-2">Spend over time</div>
                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={byDay}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} />
                                <YAxis />
                                <Tooltip formatter={(v) => INR.format(Number(v || 0))} />
                                <Legend />
                                <Line type="monotone" dataKey="total" name="Total" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Category totals */}
                    <div className="border rounded-xl p-3">
                        <div className="font-medium mb-2">Totals by category</div>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={byCategory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip formatter={(v) => INR.format(Number(v || 0))} />
                                <Legend />
                                <Bar dataKey="total" name="Total" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Reimbursable split */}
                    <div className="border rounded-xl p-3 bg-white md:col-span-2 overflow-visible">
                        <div className="font-medium mb-2">Reimbursable vs Non-reimbursable</div>
                        <div className="h-[260px] overflow-visible">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
                                    <Tooltip formatter={(v) => INR.format(Number(v || 0))} />
                                    <Legend />
                                    <Pie
                                        data={reimbSplit}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}      // small radius to avoid clipping
                                        paddingAngle={2}      // subtle gap between slices
                                        label
                                        labelLine={false}
                                    >
                                        {reimbSplit.map((_, i) => (
                                            <Cell
                                                key={i}
                                                fill={PIE_COLORS[i % PIE_COLORS.length]}
                                                stroke="#ffffff"
                                                strokeWidth={1}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
