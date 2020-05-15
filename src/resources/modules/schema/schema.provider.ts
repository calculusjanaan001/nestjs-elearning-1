import { Schema, Types } from 'mongoose';

import { Module } from '../model/module.model';

const ModuleSchema = new Schema<Module>({
  title: { type: String, required: true, trim: true },
  text: { type: String, required: true, trim: true },
  course: { type: Types.ObjectId, ref: 'Course' },
  isActive: { type: String, default: true },
  slug: { type: String, required: true, trim: true },
  // eslint-disable-next-line @typescript-eslint/camelcase
  slug_history: [{ type: String, required: true, trim: true }],
  updatedAt: Date,
  createdAt: Date,
});

export const ModuleSchemaProvider = {
  name: 'Module',
  useFactory: (): Schema<Module> => {
    ModuleSchema.pre<Module>('save', async function() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const module = this;
      const now = new Date().toISOString();

      module.createdAt = now;
      module.updatedAt = now;
    });

    return ModuleSchema;
  },
};
