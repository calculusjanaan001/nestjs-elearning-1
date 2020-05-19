import { Document, Types } from 'mongoose';

export enum SubscriptionStatus {
  PENDING = 'pending',
  COMPLETE = 'complete',
}

export interface Subscription extends Document {
  course: Types.ObjectId;
  completedModules: Types.ObjectId[];
  moduleInProgress: Types.ObjectId | null;
  status: SubscriptionStatus;
  subscriber: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}
