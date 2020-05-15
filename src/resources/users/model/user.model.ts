import { Document } from 'mongoose';

export interface User extends Document {
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}
