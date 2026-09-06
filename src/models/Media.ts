import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  title: string;
  url: string;
  size: string;
  tag: string;
  isDoc: boolean;
  description?: string;
  date?: string;
  createdAt: Date;
}

const MediaSchema: Schema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: String, default: '1.0 MB' },
  tag: { type: String, default: 'GALLERY' },
  isDoc: { type: Boolean, default: false },
  description: { type: String, default: '' },
  date: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

MediaSchema.index({ isDoc: 1, createdAt: -1 });

if (mongoose.models.Media && !mongoose.models.Media.schema.paths.description) {
  delete (mongoose.models as any).Media;
}

export default mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);

