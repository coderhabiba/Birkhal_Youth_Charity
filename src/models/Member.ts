import mongoose, { Schema, Document } from 'mongoose';

export interface IMember extends Document {
  nameBn: string;
  nameEn: string;
  fatherHusbandName?: string;
  motherName: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  mobileNumber: string;
  whatsappNumber?: string;
  email?: string;
  nidOrBirthCert?: string;
  presentAddress: string;
  permanentAddress: string;
  photoUrl?: string; // Optional for now
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const MemberSchema: Schema = new Schema({
  nameBn: { type: String, required: true },
  nameEn: { type: String, required: false, default: '' },
  fatherHusbandName: { type: String, required: false, default: '' },
  motherName: { type: String, required: true },
  dateOfBirth: { type: String, required: false, default: '' },
  bloodGroup: { type: String, required: false, default: '' },
  mobileNumber: { type: String, required: true },
  whatsappNumber: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  nidOrBirthCert: { type: String, required: false, default: '' },
  presentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  photoUrl: { type: String, required: false, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);
