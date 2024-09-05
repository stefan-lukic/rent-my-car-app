import mongoose, { Schema, Document, Model } from 'mongoose';
import { CarType } from './CarType';

export interface ICar extends Document {
  make: string;
  carModel: string;
  engine: string;
  power: string;
  carType: CarType;
  city: string;
  firstRegistration?: Date;
  image?: string;
}

const CarSchema: Schema<ICar> = new Schema(
  {
    make: { type: String, required: true },
    carModel: { type: String, required: true },
    engine: { type: String, required: true },
    power: { type: String, required: true },
    carType: { type: String, required: true, enum: Object.values(CarType) },
    firstRegistration: { type: Date },
    city: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const Car: Model<ICar> =
  mongoose.models.Car || mongoose.model<ICar>('Car', CarSchema);
export default Car;
