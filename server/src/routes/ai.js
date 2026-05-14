import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import Expense from "../models/Expense.js";

dotenv.config();

const router = express.Router();

/* =========================================================
   🔥 FIX 1: USE WORKING MODEL
========================================================= */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", // ✅ FIXED
});

/* =========================================================
   🔹 HELPER: BUILD SUMMARY
========================================================= */
function buildSummary(expenses, income = 0) {
  let total = 0;
  const categoryMap = {};

  expenses.forEach(e => {
    const amount = Number(e.amount || 0);
    const cat = e.category || e.aiCategory || "Other";

    total += amount;
    categoryMap[cat] = (categoryMap[cat] || 0) + amount;
  });

  return {
    income,
    total_spent: total,
    transaction_count: expenses.length,
    categories: categoryMap,
  };
}

/* =========================================================
   🔥 RULE FALLBACK (IMPORTANT)
========================================================= */
function generateRuleInsights(expenses, income) {
  const insights = [];

  let total = 0;
  expenses.forEach(e => total += Number(e.amount || 0));

  if (income > 0) {
    const percent = (total / income) * 100;

    if (percent > 70) {
      insights.push({
        type: "warning",
        message: `You spent ${percent.toFixed(1)}% of your income`,
      });
    }
  }

  if (expenses.length > 20) {
    insights.push({
      type: "insight",
      message: "You have many transactions — track carefully",
    });
  }

  return insights;
}

/* =========================================================
   🔥 AI INSIGHTS ROUTE (FINAL FIX)
========================================================= */
router.get("/insights", async (req, res) => {
  try {
    console.log("AI Insights API HIT");

    const expenses = await Expense.find().limit(50);

    if (!expenses.length) {
      return res.json({
        insights: [{ type: "info", message: "No expenses found" }]
      });
    }

    const income = Number(req.query.income || 0);

    const summary = buildSummary(expenses, income);

    /* =========================================================
       🔥 STRONG PROMPT (IMPORTANT FIX)
    ========================================================= */
    const prompt = `
You are a professional financial advisor.

Generate 6 to 10 insights.

Return ONLY JSON:
{
  "insights": [
    {
      "type": "warning | tip | insight | good",
      "message": "clear insight"
    }
  ]
}

User Data:
${JSON.stringify(summary)}
`;

    /* =========================================================
       🔥 SAFE AI CALL
    ========================================================= */
    let aiInsights = [];

    try {
      console.log("Calling AI...");

      const result = await model.generateContent(prompt);

      console.log("AI responded");

      let text = result.response.text();

      console.log("RAW:", text);

      text = text.replace(/```json|```/g, "").trim();

      const match = text.match(/\{[\s\S]*\}/);

      if (match) {
        const parsed = JSON.parse(match[0]);
        aiInsights = parsed.insights || [];
      }

    } catch (err) {
      console.error("AI FAILED:", err.message);
    }

    /* =========================================================
       🔥 MERGE WITH RULE INSIGHTS
    ========================================================= */
    const ruleInsights = generateRuleInsights(expenses, income);

    let combined = [...aiInsights, ...ruleInsights];

    // remove duplicates
    const unique = [];
    const seen = new Set();

    for (const i of combined) {
      if (i.message && !seen.has(i.message)) {
        seen.add(i.message);
        unique.push(i);
      }
    }

    /* =========================================================
       🔥 GUARANTEE MINIMUM INSIGHTS
    ========================================================= */
    while (unique.length < 6) {
      unique.push({
        type: "tip",
        message: "Add more transactions to improve insights",
      });
    }

    console.log("FINAL INSIGHTS:", unique.length);

    res.json({
      insights: unique.slice(0, 10),
    });

  } catch (err) {
    console.error("AI ERROR:", err);

    res.status(500).json({
      error: "AI processing failed",
      message: err.message,
    });
  }
});

export default router;