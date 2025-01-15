import mongoose, { Schema, Document, Model } from 'mongoose';
import { CarType } from './CarType';
import { CarMake } from './CarMake';
import { CarEngineType } from './CarEngineType';
import { CarCity } from './CarCity';

export interface ICar extends Document {
  _id: string;
  make: CarMake;
  carModel: string;
  engine: CarEngineType;
  power: string;
  carType: CarType;
  city: CarCity;
  carLocation: string;
  firstRegistration?: Date;
  images?: string[];
  pricePerDay: number;
  owner: mongoose.Types.ObjectId;
}

const carSchema: Schema<ICar> = new Schema(
  {
    make: { type: String, required: true, enum: Object.values(CarMake) },
    carModel: { type: String, required: true },
    engine: {
      type: String,
      required: true,
      enum: Object.values(CarEngineType),
    },
    power: { type: String, required: true },
    carType: { type: String, required: true, enum: Object.values(CarType) },
    firstRegistration: { type: Date },
    city: { type: String, required: true, enum: Object.values(CarCity) },
    carLocation: { type: String, required: true },
    images: { type: [String] },
    pricePerDay: { type: Number, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

const Car: Model<ICar> =
  mongoose.models.Car || mongoose.model<ICar>('Car', carSchema);
export default Car;
