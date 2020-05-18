import { Document, Types } from 'mongoose';

export interface Subject extends Document {
  title: string;
  courses: Types.ObjectId[];
  owner: Types.ObjectId;
  isActive: boolean;
  slug: string;
  slug_history: string[];
  createdAt: string;
  updatedAt: string;
}
