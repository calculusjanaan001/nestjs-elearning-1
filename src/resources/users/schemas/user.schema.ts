import * as mongoose from 'mongoose';

const defaultDate = new Date().toISOString();

export const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, default: 'student' },
  firstName: String,
  lastName: String,
  updatedAt: { type: Date, default: defaultDate },
  createdAt: { type: Date, default: defaultDate },
});
