import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  title: string;
  amount: number;
  category: string;
  date: string;
  spentBy?: string;
  voucherNo?: string;
  notes?: string;
  createdAt: Date;
}

const ExpenseSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, default: 'General' },
  date: { type: String, required: true },
  spentBy: { type: String, required: false, default: '' },
  voucherNo: { type: String, required: false, default: '' },
  notes: { type: String, required: false, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
