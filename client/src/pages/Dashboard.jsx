import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listExpenses, createExpense, removeExpense } from "../api/expenses";

import { bulkCreateExpenses } from "../api/expenses";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";
import ChatPopup from "../components/ChatPopup";

const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

function timeAgo(iso) {
  const d = new Date(iso);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const dd = Math.floor(h / 24);
  if (dd < 30) return `${dd}d ago`;
  return d.toLocaleDateString();
}

export default function Dashboard() {
  const qc = useQueryClient();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [reimbursable, setReimb] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // 🔥 BULK STATE (ADDED)
  const [bulkText, setBulkText] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);

  const params = useMemo(() => ({
    page,
    limit: 10,
    q,
    category,
    reimbursable,
    sort: "-createdAt",
    from: fromDate || undefined,
    to: toDate || undefined,
  }), [page, q, category, reimbursable, fromDate, toDate]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["expenses", params],
    queryFn: () => listExpenses(params),
    keepPreviousData: true,
  });

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [taxRate, setTax] = useState("");
  const [catNew, setCatNew] = useState("");
  const [reimbNew, setReimbNew] = useState("false");

  const setThisMonth = () => {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    const pad = (n) => String(n).padStart(2, "0");
    const last = new Date(y, m + 1, 0).getDate();
    setFromDate(`${y}-${pad(m + 1)}-01`);
    setToDate(`${y}-${pad(m + 1)}-${pad(last)}`);
  };

  const mCreate = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      setTitle(""); setAmount(""); setTax(""); setCatNew(""); setReimbNew("false");
      qc.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  const mDelete = useMutation({
    mutationFn: removeExpense,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses"] }),
  });

const handleBulkUpload = async () => {
  try {
    setBulkLoading(true);

    const parsed = JSON.parse(bulkText);

    if (!Array.isArray(parsed)) {
      alert("Invalid format. Use JSON array.");
      return;
    }

    if (parsed.length > 2000) {
      alert("Max 2000 entries allowed");
      return;
    }

    // ✅ FIX: use API instead of fetch
    await bulkCreateExpenses(parsed);

    alert("Bulk upload successful 🚀");

    setBulkText("");
    qc.invalidateQueries({ queryKey: ["expenses"] });

  } catch (err) {
    alert("Invalid JSON or upload failed");
  } finally {
    setBulkLoading(false);
  }
};

  useEffect(() => { setPage(1); }, [q, category, reimbursable, fromDate, toDate]);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? 10;
  const start = (data?.page - 1) * limit + 1 || 0;
  const end = Math.min(start + items.length - 1, total);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pageTotal = items.reduce((sum, e) => sum + (Number(e.total) || 0), 0);
  const reimbCount = items.filter(e => e.reimbursable).length;

  const hasActiveFilters = !!q || !!category || !!reimbursable || !!fromDate || !!toDate;

  return (
    <div className="max-w-6xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Expenses</h2>
          <div className="text-sm text-gray-600">
            {total > 0
              ? <>Showing <strong>{start}-{end}</strong> of <strong>{total}</strong> records</>
              : <>No records yet</>}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard label="This page total" value={INR.format(pageTotal)} />
          <StatCard label="On page (reimbursable)" value={`${reimbCount}/${items.length || 0}`} />
          <StatCard label="Pages" value={`${totalPages}`} />
        </div>
      </div>

      {/* Filters */}
      <div className="border rounded-xl p-3 space-y-2">
        <div className="flex flex-wrap gap-2">
          <input type="date" className="border p-2 rounded-md" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <input type="date" className="border p-2 rounded-md" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          <button className="border px-3 py-2 rounded-md" onClick={setThisMonth}>This month</button>
          <input className="border p-2 rounded-md" placeholder="Search title…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="border p-2 rounded-md" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            <option>Food</option><option>Travel</option><option>Office</option><option>Other</option>
          </select>
          <select className="border p-2 rounded-md" value={reimbursable} onChange={(e) => setReimb(e.target.value)}>
            <option value="">Any</option>
            <option value="true">Reimbursable</option>
            <option value="false">Non-reimbursable</option>
          </select>
        </div>
      </div>

      {/* Quick add */}
      <div className="border rounded-xl p-4">
        <div className="font-medium mb-2">Quick add</div>
        <div className="grid md:grid-cols-5 gap-2">
          <input className="border p-2 rounded-md" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="border p-2 rounded-md" type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <input className="border p-2 rounded-md" type="number" placeholder="Tax %" value={taxRate} onChange={(e) => setTax(e.target.value)} />
          <select className="border p-2 rounded-md" value={reimbNew} onChange={(e) => setReimbNew(e.target.value)}>
            <option value="false">Non-reimbursable</option>
            <option value="true">Reimbursable</option>
          </select>
        </div>
        <button
          onClick={() => mCreate.mutate({
            title,
            amount: Number(amount || 0),
            taxRate: Number(taxRate || 0),
            category: catNew || "Other",
            reimbursable: reimbNew === "true",
          })}
          className="mt-2 bg-black text-white px-4 py-2 rounded-md"
        >
          Add
        </button>
      </div>

      {/* 🔥 BULK UPLOAD (ADDED ONLY) */}
      <div className="border rounded-xl p-4">
        <div className="font-medium mb-2">Bulk Upload (1000+ entries)</div>

        <textarea
          className="w-full border p-2 rounded-md h-32"
          placeholder="Paste JSON array here..."
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
        />

        <button
          onClick={handleBulkUpload}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md"
          disabled={bulkLoading}
        >
          {bulkLoading ? "Uploading..." : "Upload Entries"}
        </button>
      </div>

     {/* Table */}
<div className="overflow-x-auto border rounded-xl">
  <table className="w-full text-sm">
    <thead>
      <tr className="bg-gray-50">
        <th className="p-2 text-left">Title</th>
        <th className="p-2">Category</th>
        <th className="p-2">Reimb</th>
        <th className="p-2">Amount</th>
        <th className="p-2">Tax %</th>
        <th className="p-2">Total</th>
        <th className="p-2">When</th>
        <th className="p-2">Actions</th>
      </tr>
    </thead>

    <tbody>
      {isLoading && (
        <tr>
          <td className="p-3" colSpan="8">
            <Spinner label="Loading expenses…" />
          </td>
        </tr>
      )}

      {isError && !isLoading && (
        <tr>
          <td className="p-3 text-red-600" colSpan="8">
            Failed to load.
          </td>
        </tr>
      )}

      {!isLoading && items.length === 0 && (
        <tr>
          <td className="p-4" colSpan="8">
            <EmptyState title="No expenses found">
              Add or upload expenses above 🚀
            </EmptyState>
          </td>
        </tr>
      )}

      {items.map((e) => (
        <tr key={e._id} className="border-t">
          <td className="p-2">{e.title}</td>

          <td className="p-2 text-center">
            <Badge color="purple">{e.category || e.aiCategory}</Badge>
          </td>

          <td className="p-2 text-center">
            <Badge color={e.reimbursable ? "green" : "red"}>
              {e.reimbursable ? "Yes" : "No"}
            </Badge>
          </td>

          <td className="p-2 text-right">
            {INR.format(e.amount)}
          </td>

          <td className="p-2 text-right">
            {Number(e.taxRate ?? 0).toFixed(0)}
          </td>

          <td className="p-2 text-right font-semibold">
            {INR.format(e.total)}
          </td>

          <td
            className="p-2 text-center"
            title={new Date(e.createdAt).toLocaleString()}
          >
            {timeAgo(e.createdAt)}
          </td>

          <td className="p-2 text-center">
            <button
              onClick={() => mDelete.mutate(e._id)}
              className="text-red-600 underline disabled:opacity-60"
              disabled={mDelete.isPending}
            >
              {mDelete.isPending ? "Deleting…" : "Delete"}
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      {/* Pagination */}
      <div>
        <button onClick={() => setPage(p => p - 1)}>Prev</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>

       <ChatPopup />
    </div>
  );
}