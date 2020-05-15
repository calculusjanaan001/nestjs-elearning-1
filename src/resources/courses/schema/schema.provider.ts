import * as mongoose from 'mongoose';

import { Course } from '../model/course.model';

const CourseSchema = new mongoose.Schema<Course>({
  title: { type: String, required: true, trim: true },
  subject: { type: mongoose.Types.ObjectId, ref: 'Subject' },
  modules: [{ type: mongoose.Types.ObjectId, ref: 'Module' }],
  isActive: { type: String, default: true },
  slug: { type: String, required: true, trim: true },
  // eslint-disable-next-line @typescript-eslint/camelcase
  slug_history: { type: Array, required: true },
  updatedAt: Date,
  createdAt: Date,
});

export const CourseSchemaProvider = {
  name: 'Course',
  useFactory: (): mongoose.Schema<Course> => {
    CourseSchema.pre<Course>('save', async function() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const course = this;
      const now = new Date().toISOString();

      course.createdAt = now;
      course.updatedAt = now;
    });

    return CourseSchema;
  },
};
