import { Document } from 'mongoose';
import { ObjectID } from 'mongodb';

export interface Course extends Document {
  subject: ObjectID;
  title: string;
  modules: ObjectID[];
  slug: string;
  slug_history: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
