import mongoose, { Schema, Document } from 'mongoose';

export interface ICommittee extends Document {
  name: string;
  nameEn?: string;
  role: string;
  roleEn?: string;
  phone?: string;
  description?: string;
  descriptionEn?: string;
  address?: string;
  addressEn?: string;
  image?: string;
  isVerified?: boolean;
}

const CommitteeSchema: Schema = new Schema({
  name: { type: String, required: true },
  nameEn: { type: String, required: false, default: '' },
  role: { type: String, required: true },
  roleEn: { type: String, required: false, default: '' },
  phone: { type: String, required: false, default: '' },
  description: { type: String, required: false, default: '' },
  descriptionEn: { type: String, required: false, default: '' },
  address: { type: String, required: false, default: '' },
  addressEn: { type: String, required: false, default: '' },
  image: { type: String, required: false },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Committee || mongoose.model<ICommittee>('Committee', CommitteeSchema);
