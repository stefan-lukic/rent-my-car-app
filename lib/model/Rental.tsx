import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRental extends Document {
  _id: string;
  car: Schema.Types.ObjectId;
  renter: Schema.Types.ObjectId;
  client: Schema.Types.ObjectId;
  carLocation: string;
  rentalPeriod: {
    startDate: Date;
    endDate: Date;
  };
  totalCost: number;
  status: 'active' | 'cancelled';
  cancelledAt?: Date;
  cancelledBy?: Schema.Types.ObjectId;
}

const rentalSchema: Schema<IRental> = new Schema(
  {
    car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
    renter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    carLocation: { type: String, required: true },
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
  },
  { timestamps: true }
);

rentalSchema.index({
  car: 1,
  'rentalPeriod.startDate': 1,
  'rentalPeriod.endDate': 1,
});

const Rental: Model<IRental> =
  mongoose.models.Rental || mongoose.model<IRental>('Rental', rentalSchema);
export default Rental;
