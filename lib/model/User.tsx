import mongoose, { Schema, Document, Model } from 'mongoose';
import { Role } from './Role';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  contactInfo: string;
  rating: number;
  emailVerified?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  images?: string[];
  role: Role;
  cars: mongoose.Types.ObjectId[];
  createdAt: Date;
}

export interface IRenter {
  _id: string;
  name: string;
  email: string;
  contactInfo: string;
  profilePicture?: string;
  rating: number;
  images?: string[];
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: false },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactInfo: { type: String, required: true },
    rating: { type: Number, required: false },
    emailVerified: { type: Date },
    emailVerificationToken: { type: String, index: true },
    emailVerificationExpires: { type: Date },
    passwordResetToken: { type: String, index: true },
    passwordResetExpires: { type: Date },
    images: { type: [String] },
    role: { type: String },
    cars: [{ type: Schema.Types.ObjectId, ref: 'Car' }],
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
