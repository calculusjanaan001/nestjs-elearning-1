import { Document, Types } from 'mongoose';

export interface Course extends Document {
  subject: Types.ObjectId;
  title: string;
  modules: Types.ObjectId[];
  slug: string;
  slug_history: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
