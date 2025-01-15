import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRental extends Document {
  _id: string;
  car: Schema.Types.ObjectId;
  renter: Schema.Types.ObjectId;
  rentee: Schema.Types.ObjectId;
  carLocation: string;
  rentalPeriod: {
    startDate: Date;
    endDate: Date;
  };
  totalCost: number;
}

const rentalSchema: Schema<IRental> = new Schema(
  {
    car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
    renter: { type: Schema.Types.ObjectId, ref: 'User', required: false }, // change to required once renter is also added
    rentee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    carLocation: { type: String, required: true },
    rentalPeriod: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    },
    totalCost: { type: Number, required: true },
  },
  { timestamps: true }
);

const Rental: Model<IRental> =
  mongoose.models.Rental || mongoose.model<IRental>('Rental', rentalSchema);
export default Rental;
