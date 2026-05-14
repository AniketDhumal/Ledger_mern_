import { Router } from "express";
import Expense from "../models/Expense.js";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
import { analyzeExpense } from "../services/aiService.js";
import { analyzeBulkExpenses } from "../services/aiService.js";
import { generateInsights } from "../services/insightService.js";

const r = Router();
r.use(auth);

const MAX_LIMIT = 100;

/* =========================================================
   🧠 INSIGHTS (⚠️ MUST BE BEFORE /:id)
========================================================= */
r.get("/insights", async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({ userId }).lean();
    const user = await User.findById(userId).lean();

    const income = user?.income || 0;

    const insights = generateInsights(expenses, income);

    res.json({ insights });

  } catch (err) {
    console.error("INSIGHT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


/* =========================================================
   ✅ GET ALL EXPENSES
========================================================= */
r.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      reimbursable,
      q,
      sort = "-createdAt",
      from,
      to,
      minAmount,
      maxAmount
    } = req.query;

    const filter = { userId: req.user.id };

    // AI + manual category
    if (category) {
      filter.$or = [
        { category },
        { aiCategory: category }
      ];
    }

    if (reimbursable === "true" || reimbursable === "false") {
      filter.reimbursable = reimbursable === "true";
    }

    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }

    const nPage = Math.max(1, Number(page));
    const nLimit = Math.min(MAX_LIMIT, Math.max(1, Number(limit)));
    const skip = (nPage - 1) * nLimit;

    const [items, total] = await Promise.all([
      Expense.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(nLimit)
        .lean(),
      Expense.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      pages: Math.ceil(total / nLimit),
      page: nPage,
      limit: nLimit,
    });

  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


/* =========================================================
   ✅ CREATE EXPENSE (PURE AI)
========================================================= */
r.post("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const text = `${req.body.title || ""} ${req.body.description || ""}`.trim();

    let ai = { category: "Other", confidence: 0.5 };

    try {
      const result = await analyzeExpense(text);

      console.log("INPUT:", text);
      console.log("AI OUTPUT:", result);

      if (result && result.category) {
        ai = result;
      }

    } catch (e) {
      console.error("AI ERROR:", e);
    }

    const exp = await Expense.create({
      title: req.body.title,
      description: req.body.description,
      amount: req.body.amount,
      taxRate: req.body.taxRate,
      reimbursable: req.body.reimbursable,
      createdAt: req.body.createdAt,

      userId,
      aiCategory: ai.category,
      aiConfidence: ai.confidence
    });

    console.log("SAVED DATA:", exp);

    res.status(201).json(exp);

  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
/* =========================================================
   ✅ BULK INSERT (PURE AI)
========================================================= */

r.post("/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    if (req.body.length > 2000) {
      return res.status(400).json({ error: "Max 2000 entries allowed" });
    }

    // 🔥 ONE AI CALL FOR ALL
    const aiResults = await analyzeBulkExpenses(req.body);

    const expenses = req.body.map((e, i) => {
      const ai = aiResults.find(a => a.index === i + 1);

      return {
        title: e.title,
        description: e.description,
        amount: Number(e.amount),
        taxRate: Number(e.taxRate || 0),
        reimbursable: !!e.reimbursable,
        userId: req.user.id,

        aiCategory: ai?.category || "Other",
        aiConfidence: 0.8
      };
    });

    const inserted = await Expense.insertMany(expenses, {
      ordered: false
    });

    res.json({
      message: "Bulk insert successful 🚀",
      count: inserted.length,
    });

  } catch (err) {
    console.error("BULK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================================================
   ✅ GET SINGLE (⚠️ KEEP LAST)
========================================================= */
r.get("/:id", async (req, res) => {
  try {
    const item = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).lean();

    if (!item) return res.status(404).json({ error: "Not found" });

    res.json(item);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================================================
   ✅ UPDATE EXPENSE
========================================================= */
r.put("/:id", async (req, res) => {
  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Not found" });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================================================
   ✅ DELETE EXPENSE
========================================================= */
r.delete("/:id", async (req, res) => {
  try {
    const { deletedCount } = await Expense.deleteOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedCount) {
      return res.status(404).json({ error: "Not found" });
    }

    res.status(204).end();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default r;