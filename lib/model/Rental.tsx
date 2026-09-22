import mongoose, { Schema, Document, Model } from 'mongoose';
import type { ClientReview, OwnerReview } from '@/types/Review';

export interface IRental extends Document {
  _id: string;
  car: Schema.Types.ObjectId;
  renter: Schema.Types.ObjectId;
  client: Schema.Types.ObjectId;
  carLocation: string;
  carSnapshot?: {
    carId: Schema.Types.ObjectId;
    make: string;
    carModel: string;
    images?: string[];
    city: string;
    carLocation: string;
    pricePerDay: number;
  };
  rentalPeriod: {
    startDate: Date;
    endDate: Date;
  };
  totalCost: number;
  status: 'active' | 'cancelled';
  cancelledAt?: Date;
  cancelledBy?: Schema.Types.ObjectId;
  clientReview?: ClientReview<Date>;
  ownerReview?: OwnerReview<Date>;
}

const rentalSchema: Schema<IRental> = new Schema(
  {
    car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
    renter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    carLocation: { type: String, required: true },
    carSnapshot: {
      type: new Schema(
        {
          carId: { type: Schema.Types.ObjectId, required: true },
          make: { type: String, required: true },
          carModel: { type: String, required: true },
          images: { type: [String], default: [] },
          city: { type: String, required: true },
          carLocation: { type: String, required: true },
          pricePerDay: { type: Number, required: true },
        },
        { _id: false }
      ),
      required: false,
    },
    rentalPeriod: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    },
    totalCost: { type: Number, required: true },
    status: {
      type: String,
      enum: ['active', 'cancelled'],
      default: 'active',
    },
    cancelledAt: { type: Date },
    cancelledBy: { type: Schema.Types.ObjectId, ref: 'User' },
    clientReview: {
      carRating: { type: Number, min: 1, max: 5 },
      ownerRating: { type: Number, min: 1, max: 5 },
      submittedAt: { type: Date },
    },
    ownerReview: {
      clientRating: { type: Number, min: 1, max: 5 },
      submittedAt: { type: Date },
    },
  },
  { timestamps: true }
);

rentalSchema.index({
  car: 1,
  'rentalPeriod.startDate': 1,
  'rentalPeriod.endDate': 1,
});
// Match the profile queries so MongoDB does not scan every rental document.
rentalSchema.index({ client: 1 });
rentalSchema.index({ renter: 1, 'rentalPeriod.startDate': 1 });

const Rental: Model<IRental> =
  mongoose.models.Rental || mongoose.model<IRental>('Rental', rentalSchema);
export default Rental;
