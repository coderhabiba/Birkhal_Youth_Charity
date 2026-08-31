import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  user: string;
  action: 'Create' | 'Update' | 'Delete';
  module: string;
  details: string;
  createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema({
  user: { type: String, required: true },
  action: { type: String, enum: ['Create', 'Update', 'Delete'], required: true },
  module: { type: String, required: true },
  details: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
