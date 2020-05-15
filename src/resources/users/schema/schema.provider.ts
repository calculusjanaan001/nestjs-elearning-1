import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from '../model/user.model';

const UserSchema = new mongoose.Schema<User>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  updatedAt: Date,
  createdAt: Date,
});

export const UserSchemaProvider = {
  name: 'User',
  useFactory: (): mongoose.Schema<User> => {
    UserSchema.pre<User>('save', async function() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const user = this;
      const now = new Date().toISOString();

      user.createdAt = now;
      user.updatedAt = now;
      user.password = await bcrypt.hash(user.password, 10);
    });

    UserSchema.methods.comparePassword = async function(password) {
      return await bcrypt.compare(password, this.password);
    };

    return UserSchema;
  },
};
