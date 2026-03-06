import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, enum: ["Food","Travel","Office","Other"], required: true },
  reimbursable: { type: Boolean, default: false },
  amount: { type: Number, required: true, min: 0 },
  taxRate: { type: Number, required: true, min: 0, max: 100 },
  total: { type: Number, required: true }
}, { timestamps: true });

ExpenseSchema.pre("validate", function(next) {
  this.total = Number((this.amount + (this.amount * this.taxRate / 100)).toFixed(2));
  next();
});

ExpenseSchema.index({ userId: 1, createdAt: -1 });
ExpenseSchema.index({ userId: 1, category: 1 });
ExpenseSchema.index({ userId: 1, reimbursable: 1 });
ExpenseSchema.index({ userId: 1, title: 1 });

export default mongoose.model("Expense", ExpenseSchema);
