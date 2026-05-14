import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    index: true, 
    required: true 
  },

  // 📝 Original user input (important for AI)
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },

  description: {
    type: String,
    trim: true
  },

  // 🤖 AI GENERATED CATEGORY
  aiCategory: {
    type: String,
    enum: ["Food", "Travel", "Office", "Bills", "Shopping", "Other"],
    index: true
  },

  // 👤 Optional manual override
  category: {
    type: String,
    enum: ["Food", "Travel", "Office", "Bills", "Shopping", "Other"],
  },

  // 🎯 AI confidence
  aiConfidence: {
    type: Number,
    min: 0,
    max: 1
  },

  reimbursable: { 
    type: Boolean, 
    default: false 
  },

  amount: { 
    type: Number, 
    required: true, 
    min: 0 
  },

  taxRate: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 100 
  },

  total: { 
    type: Number, 
    required: true 
  },

  // 📅 Custom date
  createdAt: {
    type: Date,
    default: Date.now
  },

  // 📊 AI insights (store per expense if needed)
  aiInsights: [
    {
      type: {
        type: String,
        enum: ["warning", "info", "good"]
      },
      message: String,
      metric: String
    }
  ]

}, {
  timestamps: { updatedAt: true }
});


// ✅ Auto calculate total
ExpenseSchema.pre("validate", function (next) {
  this.total = Number(
    (this.amount + (this.amount * this.taxRate / 100)).toFixed(2)
  );
  next();
});


// ✅ Indexes (optimized for AI queries)
ExpenseSchema.index({ userId: 1, createdAt: -1 });
ExpenseSchema.index({ userId: 1, aiCategory: 1 });
ExpenseSchema.index({ userId: 1, reimbursable: 1 });
ExpenseSchema.index({ userId: 1, title: 1 });

export default mongoose.model("Expense", ExpenseSchema);