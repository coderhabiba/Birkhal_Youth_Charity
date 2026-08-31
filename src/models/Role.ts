import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
  nameBn?: string;
  description: string;
  isCritical: boolean;
  usersAssigned: number;
  permissions: {
    volunteers: { view: boolean; edit: boolean; delete: boolean };
    events: { view: boolean; edit: boolean; delete: boolean };
    financial: { view: boolean; edit: boolean; delete: boolean };
    content: { view: boolean; edit: boolean; delete: boolean };
    settings: { view: boolean; edit: boolean; delete: boolean };
  };
  createdAt: Date;
}

const RoleSchema: Schema = new Schema({
  name: { type: String, required: true },
  nameBn: { type: String },
  description: { type: String, required: true },
  isCritical: { type: Boolean, default: false },
  usersAssigned: { type: Number, default: 0 },
  permissions: {
    volunteers: {
      view: { type: Boolean, default: true },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
    },
    events: {
      view: { type: Boolean, default: true },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
    },
    financial: {
      view: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
    },
    content: {
      view: { type: Boolean, default: true },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
    },
    settings: {
      view: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
    },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Role || mongoose.model<IRole>('Role', RoleSchema);
