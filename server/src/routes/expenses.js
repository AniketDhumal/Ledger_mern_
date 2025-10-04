import { Router } from "express";
import Expense from "../models/Expense.js";
import { auth } from "../middleware/auth.js";

const r = Router();
r.use(auth);

// GET /api/expenses
// GET /api/expenses
r.get("/", async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    reimbursable,
    q,
    sort = "-createdAt",
    from,
    to,
  } = req.query;

  const filter = { userId: req.user.id };

  if (category) filter.category = category;

  // keep your semantics, but ignore invalid values
  if (typeof reimbursable !== "undefined") {
    if (reimbursable === "true" || reimbursable === "false") {
      filter.reimbursable = reimbursable === "true";
    }
  }

  if (q) filter.title = { $regex: q, $options: "i" };

  // NEW: optional date window on createdAt
  if (from || to) {
    filter.createdAt = {};
    if (from) {
      const f = new Date(from);
      if (isNaN(f)) return res.status(400).json({ error: "Invalid 'from' date" });
      filter.createdAt.$gte = f;
    }
    if (to) {
      const t = new Date(to);
      if (isNaN(t)) return res.status(400).json({ error: "Invalid 'to' date" });
      filter.createdAt.$lte = t;
    }
  }

  const nPage = Number(page) || 1;
  const nLimit = Math.max(1, Number(limit) || 10);
  const skip = (nPage - 1) * nLimit;

  const [items, total] = await Promise.all([
    Expense.find(filter).sort(String(sort)).skip(skip).limit(nLimit),
    Expense.countDocuments(filter),
  ]);

  res.json({
    items,
    total,
    pages: Math.ceil(total / nLimit),
    page: nPage,
    limit: nLimit,
  });
});


// POST /api/expenses
r.post("/", async (req, res) => {
  const exp = await Expense.create({ ...req.body, userId: req.user.id });
  res.status(201).json(exp);
});

// GET /api/expenses/:id
r.get("/:id", async (req, res) => {
  const item = await Expense.findOne({ _id: req.params.id, userId: req.user.id });
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

// PUT /api/expenses/:id
r.put("/:id", async (req, res) => {
  const updated = await Expense.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
});

// DELETE /api/expenses/:id
r.delete("/:id", async (req, res) => {
  const { deletedCount } = await Expense.deleteOne({ _id: req.params.id, userId: req.user.id });
  if (!deletedCount) return res.status(404).json({ error: "Not found" });
  res.status(204).end();
});

export default r;
 