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
  images?: string[];
  role: Role;
  cars: mongoose.Types.ObjectId[];
  rentals: mongoose.Types.ObjectId[];
  createdAt: Date;
}

export interface IOwner {
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
    contactInfo: { type: String, required: false },
    rating: { type: Number, required: false },
    emailVerified: { type: Date },
    images: { type: [String] },
    role: { type: String },
    cars: [{ type: Schema.Types.ObjectId, ref: 'Car' }], // Cars owned by the user
    rentals: [{ type: Schema.Types.ObjectId, ref: 'Rental' }], // Cars rented by the user
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
