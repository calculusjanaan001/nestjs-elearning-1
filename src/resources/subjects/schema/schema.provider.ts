import * as mongoose from 'mongoose';

import { Subject } from '../model/subject.model';

const SubjectSchema = new mongoose.Schema<Subject>({
  title: { type: String, required: true, trim: true },
  courses: [{ type: mongoose.Types.ObjectId, ref: 'Course' }],
  owner: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: String, default: true },
  slug: { type: String, required: true, trim: true },
  // eslint-disable-next-line @typescript-eslint/camelcase
  slug_history: { type: Array, required: true },
  updatedAt: Date,
  createdAt: Date,
});

export const SubjectSchemaProvider = {
  name: 'Subject',
  useFactory: (): mongoose.Schema<Subject> => {
    SubjectSchema.pre<Subject>('save', async function() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const subject = this;
      const now = new Date().toISOString();

      subject.createdAt = now;
      subject.updatedAt = now;
    });

    return SubjectSchema;
  },
};
