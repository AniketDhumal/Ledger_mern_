export function generateInsights(expenses = [], income = 0) {
  const insights = [];

  if (!Array.isArray(expenses) || expenses.length === 0) {
    return insights;
  }

  let total = 0;
  const categoryMap = {};
  const dailyMap = {};

  // 🔥 Process data
  expenses.forEach(e => {
    const amount = Number(e.amount || 0);
    const cat = e.category || e.aiCategory || "Other";
    const date = new Date(e.createdAt).toDateString();

    total += amount;

    categoryMap[cat] = (categoryMap[cat] || 0) + amount;
    dailyMap[date] = (dailyMap[date] || 0) + amount;
  });

  const categories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  /* =========================================================
     🔥 1. Top Category
  ========================================================= */
  if (categories.length > 0) {
    const [topCat, topVal] = categories[0];

    insights.push({
      type: "insight",
      metric: "Top Category",
      value: topVal,
      message: `${topCat} dominates your spending (₹${topVal})`
    });
  }

  /* =========================================================
     🔥 2. Category Dominance (>40%)
  ========================================================= */
  categories.forEach(([cat, val]) => {
    const percent = (val / total) * 100;

    if (percent > 40) {
      insights.push({
        type: "warning",
        metric: "Category Share",
        value: percent,
        message: `${cat} takes ${percent.toFixed(1)}% of your expenses`
      });
    }
  });

  /* =========================================================
     🔥 3. Income Usage
  ========================================================= */
  if (income > 0) {
    const percent = (total / income) * 100;

    if (percent > 75) {
      insights.push({
        type: "warning",
        metric: "Income Usage",
        value: percent,
        message: `You spent ${percent.toFixed(1)}% of your income`
      });
    } else if (percent < 40) {
      insights.push({
        type: "good",
        metric: "Budget Health",
        value: percent,
        message: "Great! Your spending is well controlled"
      });
    }
  }

  /* =========================================================
     🔥 4. High Value Transactions
  ========================================================= */
  const high = expenses.filter(e => e.amount > 500);

  if (high.length > 0) {
    insights.push({
      type: "warning",
      metric: "High Expenses",
      value: high.length,
      message: `You made ${high.length} large transactions (> ₹500)`
    });
  }

  /* =========================================================
     🔥 5. Frequent Small Expenses (Money Leak)
  ========================================================= */
  const small = expenses.filter(e => e.amount < 100);

  if (small.length > 10) {
    insights.push({
      type: "tip",
      metric: "Micro Spending",
      value: small.length,
      message: "Frequent small expenses may be draining your budget"
    });
  }

  /* =========================================================
     🔥 6. Daily Spending Spikes
  ========================================================= */
  const dailyValues = Object.values(dailyMap);
  const avgDaily = total / dailyValues.length;

  const spikes = dailyValues.filter(v => v > avgDaily * 1.5).length;

  if (spikes > 0) {
    insights.push({
      type: "insight",
      metric: "Spending Spikes",
      value: spikes,
      message: `You had ${spikes} unusually high spending days`
    });
  }

  /* =========================================================
     🔥 7. Trend Analysis
  ========================================================= */
  const mid = Math.floor(expenses.length / 2);

  const firstHalf = expenses
    .slice(0, mid)
    .reduce((s, e) => s + Number(e.amount || 0), 0);

  const secondHalf = expenses
    .slice(mid)
    .reduce((s, e) => s + Number(e.amount || 0), 0);

  if (secondHalf > firstHalf * 1.2) {
    insights.push({
      type: "warning",
      metric: "Trend",
      message: "Your spending is increasing over time 📈"
    });
  }

  /* =========================================================
     🔥 8. Smart Suggestions
  ========================================================= */
  if (categoryMap["Food"] > total * 0.3) {
    insights.push({
      type: "tip",
      metric: "Food Spending",
      message: "Reducing food delivery can save significant money"
    });
  }

  if (categoryMap["Shopping"] > total * 0.25) {
    insights.push({
      type: "tip",
      metric: "Shopping",
      message: "Try limiting impulse purchases"
    });
  }

  /* =========================================================
     🔥 9. Fallback Guarantee
  ========================================================= */
  if (insights.length < 5) {
    insights.push({
      type: "tip",
      message: "Track your expenses regularly for better insights"
    });
  }

  return insights.slice(0, 10); // 🔥 limit max insights
}