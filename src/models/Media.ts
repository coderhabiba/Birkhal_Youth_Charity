import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  title: string;
  url: string;
  size: string;
  tag: string;
  isDoc: boolean;
  createdAt: Date;
}

const MediaSchema: Schema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: String, default: '1.0 MB' },
  tag: { type: String, default: 'GENERAL' },
  isDoc: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);
