import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

/* =========================================================
   🔹 SINGLE EXPENSE AI (IMPROVED)
========================================================= */
export async function analyzeExpense(text) {
  try {
    const prompt = `
Classify this expense into ONE category.

Categories:
Food, Travel, Bills, Shopping, Entertainment, Health, Education, Groceries, Other

Return ONLY JSON:
{
  "category": "string",
  "confidence": number
}

Text: "${text}"
`;

    const result = await model.generateContent(prompt);
    let response = result.response.text();

    response = response.replace(/```json|```/g, "").trim();

    const match = response.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Invalid JSON");

    return JSON.parse(match[0]);

  } catch (err) {
    console.error("AI ERROR:", err.message);

    return {
      category: "Other",
      confidence: 0.5,
    };
  }
}

/* =========================================================
   🔥 BULK AI (IMPROVED)
========================================================= */
export async function analyzeBulkExpenses(expenses) {
  try {
    const list = expenses.map((e, i) =>
      `${i + 1}. ${e.title} ${e.description || ""}`
    ).join("\n");

    const prompt = `
You are a strict financial classifier.

Categories:
Food, Travel, Bills, Shopping, Entertainment, Health, Education, Groceries, Other

Rules:
- Return ONLY JSON array
- No explanation
- Always match index

Format:
[
  { "index": 1, "category": "Food" }
]

Expenses:
${list}
`;

    const result = await model.generateContent(prompt);
    let response = result.response.text();

    response = response.replace(/```json|```/g, "").trim();

    const match = response.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("Invalid JSON array");

    return JSON.parse(match[0]);

  } catch (err) {
    console.error("BULK AI ERROR:", err.message);
    return [];
  }
}

/* =========================================================
   🔥 AI INSIGHTS ENGINE (FINAL)
========================================================= */
export async function generateAIInsights(expenses = [], income = 0) {
  try {
    if (!expenses.length) return [];

    let total = 0;
    const categoryMap = {};
    const dailyMap = {};

    expenses.forEach(e => {
      const amount = Number(e.amount || 0);
      const cat = e.category || e.aiCategory || "Other";
      const date = new Date(e.createdAt).toDateString();

      total += amount;
      categoryMap[cat] = (categoryMap[cat] || 0) + amount;
      dailyMap[date] = (dailyMap[date] || 0) + amount;
    });

    const summary = {
      income,
      total_spent: total,
      transaction_count: expenses.length,
      avg_transaction: total / expenses.length,
      categories: categoryMap,
      daily_spending: dailyMap,
      top_expenses: expenses
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5),
    };

    const prompt = `
You are a professional financial advisor AI.

Generate 6 to 10 HIGH QUALITY insights.

You MUST include:
1. Spending risks
2. Saving tips
3. Behavioral patterns
4. Good habits
5. Category insights
6. Unusual spending

Rules:
- Each insight must be unique
- Use numbers when possible
- Avoid generic advice

Return ONLY JSON:
{
  "insights": [
    {
      "type": "warning | tip | insight | good",
      "message": "clear insight",
      "metric": "short label",
      "value": number or string
    }
  ]
}

User Data:
${JSON.stringify(summary)}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    text = text.replace(/```json|```/g, "").trim();

    let insights = [];

    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Invalid JSON");

      const parsed = JSON.parse(match[0]);
      insights = parsed.insights || [];

    } catch (err) {
      console.error("PARSE ERROR:", err.message);
    }

    /* =========================================================
       🔥 FALLBACK (CRITICAL FIX)
    ========================================================= */

    if (insights.length < 5) {
      insights.push({
        type: "tip",
        message: "Track your daily expenses to improve insights",
      });

      insights.push({
        type: "insight",
        message: `You made ${expenses.length} transactions`,
        metric: "Transactions",
        value: expenses.length,
      });
    }

    return insights;

  } catch (err) {
    console.error("AI ERROR:", err.message);
    return [];
  }
}