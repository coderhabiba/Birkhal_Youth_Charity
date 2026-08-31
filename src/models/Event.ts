import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: Date;
  location: string;
  description: string;
  image?: string;
  contactPhone?: string;
  type: 'fundraiser' | 'workshop' | 'campaign' | 'meeting';
  status: 'upcoming' | 'ongoing' | 'completed';
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: false },
  contactPhone: { type: String, required: false },
  type: { type: String, enum: ['fundraiser', 'workshop', 'campaign', 'meeting'], default: 'campaign' },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' }
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
