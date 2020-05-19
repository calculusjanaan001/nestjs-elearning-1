import { Document, Types } from 'mongoose';

export interface Module extends Document {
  title: string;
  text: string;
  course: Types.ObjectId;
  slug: string;
  slug_history: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
