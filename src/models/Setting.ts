import mongoose, { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  value: string;
  category: 'general' | 'contact' | 'social';
}

const SettingSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  category: { type: String, enum: ['general', 'contact', 'social'], default: 'general' }
}, { timestamps: true });

export default mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);
