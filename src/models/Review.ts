import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  name: string;
  designation: string;
  comment: string;
  rating: number;
  image?: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  image: { type: String, default: '' },
  status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

ReviewSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
