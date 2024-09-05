import mongoose, { Schema, Document, Model } from 'mongoose';
import { Role } from './Role';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  emailVerified?: Date;
  image?: string;
  role: Role;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: false },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Date },
    image: { type: String },
    role: { type: String },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
