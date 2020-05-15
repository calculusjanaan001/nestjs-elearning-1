import { Document } from 'mongoose';
import { ObjectID } from 'mongodb';

export interface Subject extends Document {
  title: string;
  courses: ObjectID[];
  owner: ObjectID;
  isActive: boolean;
  slug: string;
  slug_history: string[];
  createdAt: string;
  updatedAt: string;
}
