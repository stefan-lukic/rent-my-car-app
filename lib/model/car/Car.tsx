import mongoose, { Schema, Model } from 'mongoose';
import { CarType } from './CarType';
import { CarMake } from './CarMake';
import { CarEngineType } from './CarEngineType';
import { CarCity } from './CarCity';
import {
  CAR_FIELD_LIMITS,
  CAR_MODEL_PATTERN,
  isNumberInRange,
} from './carValidation';

export interface ICar {
  _id: string;
  make: CarMake;
  carModel: string;
  engine: CarEngineType;
  power: string;
  seats?: number;
  carType: CarType;
  city: CarCity;
  carLocation: string;
  firstRegistration?: Date;
  milage: number;
  averageConsumption: string;
  images?: string[];
  pricePerDay: number;
  description?: string;
  renter: mongoose.Types.ObjectId;
  status?: string;
  rating?: number;
  ratingCount?: number;
  bookedPeriods: {
    rental: mongoose.Types.ObjectId;
    startDate: Date;
    endDate: Date;
  }[];
}

const carSchema: Schema<ICar> = new Schema(
  {
    make: { type: String, required: true, enum: Object.values(CarMake) },
    carModel: {
      type: String,
      required: true,
      trim: true,
      maxlength: CAR_FIELD_LIMITS.modelLength,
      match: CAR_MODEL_PATTERN,
    },
    engine: {
      type: String,
      required: true,
      enum: Object.values(CarEngineType),
    },
    power: {
      type: String,
      required: true,
      validate: (value: string) =>
        isNumberInRange(
          value,
          CAR_FIELD_LIMITS.horsepower.min,
          CAR_FIELD_LIMITS.horsepower.max,
          true
        ),
    },
    seats: {
      type: Number,
      required: true,
      min: CAR_FIELD_LIMITS.seats.min,
      max: CAR_FIELD_LIMITS.seats.max,
    },
    carType: { type: String, required: true, enum: Object.values(CarType) },
    city: { type: String, required: true, enum: Object.values(CarCity) },
    carLocation: {
      type: String,
      required: true,
      trim: true,
      maxlength: CAR_FIELD_LIMITS.locationLength,
    },
    firstRegistration: { type: Date },
    milage: {
      type: Number,
      required: true,
      min: CAR_FIELD_LIMITS.mileage.min,
      max: CAR_FIELD_LIMITS.mileage.max,
    },
    averageConsumption: {
      type: String,
      required: true,
      validate: (value: string) =>
        isNumberInRange(
          value,
          CAR_FIELD_LIMITS.averageConsumption.min,
          CAR_FIELD_LIMITS.averageConsumption.max
        ),
    },
    images: { type: [String] },
    pricePerDay: {
      type: Number,
      required: true,
      min: CAR_FIELD_LIMITS.pricePerDay.min,
      max: CAR_FIELD_LIMITS.pricePerDay.max,
    },
    description: {
      type: String,
      required: false,
      maxlength: CAR_FIELD_LIMITS.descriptionLength,
    },
    renter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
    bookedPeriods: {
      type: [
        {
          rental: {
            type: Schema.Types.ObjectId,
            ref: 'Rental',
            required: true,
          },
          startDate: { type: Date, required: true },
          endDate: { type: Date, required: true },
        },
      ],
      default: [],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const Car: Model<ICar> =
  mongoose.models.Car || mongoose.model<ICar>('Car', carSchema);
export default Car;
