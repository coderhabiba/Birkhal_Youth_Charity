import mongoose, { Schema, Document } from 'mongoose';

export interface IDonationEntry extends Document {
  donorName: string;
  amount: number;
  date: string;
  category: string;
  mobileNumber?: string;
  transactionId?: string;
  status: 'Completed' | 'Pending';
  createdAt: Date;
}

const DonationEntrySchema: Schema = new Schema({
  donorName: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  category: { type: String, default: 'General' },
  mobileNumber: { type: String, required: false, default: '' },
  transactionId: { type: String, required: false, default: '' },
  status: { type: String, enum: ['Completed', 'Pending'], default: 'Completed' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.DonationEntry || mongoose.model<IDonationEntry>('DonationEntry', DonationEntrySchema);
