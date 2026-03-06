
import api from "./client";


function toIsoOrUndef(value, endOfDay = false) {
  if (!value) return undefined;

  
  if (value instanceof Date && !isNaN(value)) {
    return value.toISOString();
  }

  
  if (typeof value === "string") {
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const isoLike = endOfDay
        ? `${value}T23:59:59.999`
        : `${value}T00:00:00.000`;
      const d = new Date(isoLike);
      return isNaN(d) ? undefined : d.toISOString();
    }
    
    const d = new Date(value);
    return isNaN(d) ? undefined : d.toISOString();
  }

  return undefined;
}


export function listExpenses({
  page = 1,
  limit = 10,
  q,
  category,
  reimbursable,
  sort = "-createdAt",
  from,
  to,
} = {}) {
  const params = {
    page,
    limit,
    q,
    category,
    sort,
    
    reimbursable:
      typeof reimbursable === "boolean" ? String(reimbursable) : reimbursable,
   
    from: toIsoOrUndef(from, false),
    to: toIsoOrUndef(to, true),
  };

  return api.get("/expenses", { params }).then((r) => r.data);
}

export function createExpense(payload) {
  return api.post("/expenses", payload).then((r) => r.data);
}

export function updateExpense(id, payload) {
  return api.put(`/expenses/${id}`, payload).then((r) => r.data);
}

export function removeExpense(id) {
  return api.delete(`/expenses/${id}`).then((r) => r.data);
}


