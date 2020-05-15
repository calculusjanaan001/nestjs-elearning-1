import { Schema, Types } from 'mongoose';

import { Subscription, SubscriptionStatus } from '../model/subscription.model';

const SubscriptionSchema = new Schema<Subscription>({
  course: { type: Types.ObjectId, ref: 'Course', required: true },
  completedModules: [{ type: Types.ObjectId, ref: 'Module' }],
  moduleInProgress: { type: Types.ObjectId, ref: 'Module', default: null },
  status: {
    type: String,
    enum: [SubscriptionStatus.PENDING, SubscriptionStatus.COMPLETE],
    default: SubscriptionStatus.PENDING,
  },
  updatedAt: Date,
  createdAt: Date,
});

export const SubscriptionSchemaProvider = {
  name: 'Subscription',
  useFactory: (): Schema<Subscription> => {
    SubscriptionSchema.pre<Subscription>('save', function() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const subscription = this;
      const now = new Date().toISOString();

      subscription.createdAt = now;
      subscription.updatedAt = now;
    });

    return SubscriptionSchema;
  },
};
