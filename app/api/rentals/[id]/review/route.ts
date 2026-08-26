import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import connectToDatabase from '@/lib/db/mongoose';
import Rental from '@/lib/model/Rental';
import User from '@/lib/model/User';
import Car from '@/lib/model/car/Car';
import {
  calculateAverageRating,
  calculateUserRating,
  isRating,
} from './rating';
import type { DatabaseId, ReviewRequestBody } from './rating';
import type {
  ClientReview,
  OwnerReview,
  SubmittedReview,
} from '@/types/Review';

type ClientReviewInput = {
  rentalId: string;
  carId: DatabaseId;
  ownerId: DatabaseId;
  clientId: string;
  carRating: number;
  ownerRating: number;
  completedBefore: Date;
  dbSession: mongoose.ClientSession;
};

type OwnerReviewInput = {
  rentalId: string;
  clientId: DatabaseId;
  ownerId: string;
  clientRating: number;
  completedBefore: Date;
  dbSession: mongoose.ClientSession;
};

type ValidatedReview =
  | { reviewer: 'client'; carRating: number; ownerRating: number }
  | { reviewer: 'owner'; clientRating: number };

async function submitClientReview({
  rentalId,
  carId,
  ownerId,
  clientId,
  carRating,
  ownerRating,
  completedBefore,
  dbSession,
}: ClientReviewInput): Promise<ClientReview<Date>> {
  const submittedAt = new Date();
  const updatedRental = await Rental.findOneAndUpdate(
    {
      _id: rentalId,
      client: clientId,
      status: { $ne: 'cancelled' },
      'rentalPeriod.endDate': { $lt: completedBefore },
      'clientReview.submittedAt': { $exists: false },
    },
    {
      $set: {
        clientReview: { carRating, ownerRating, submittedAt },
      },
    },
    { new: true, session: dbSession }
  ).lean();

  if (!updatedRental) throw new Error('REVIEW_ALREADY_SUBMITTED');

  const [calculatedOwnerRating, carRatingResult] = await Promise.all([
    calculateUserRating(ownerId, dbSession),
    Rental.aggregate([
      {
        $match: {
          car: carId,
          'clientReview.carRating': { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          average: { $avg: '$clientReview.carRating' },
          count: { $sum: 1 },
        },
      },
    ]).session(dbSession),
  ]);

  await Promise.all([
    User.findByIdAndUpdate(ownerId, calculatedOwnerRating, {
      session: dbSession,
    }),
    Car.findByIdAndUpdate(carId, calculateAverageRating(carRatingResult), {
      session: dbSession,
    }),
  ]);

  return { carRating, ownerRating, submittedAt };
}

async function submitOwnerReview({
  rentalId,
  clientId,
  ownerId,
  clientRating,
  completedBefore,
  dbSession,
}: OwnerReviewInput): Promise<OwnerReview<Date>> {
  const submittedAt = new Date();
  const updatedRental = await Rental.findOneAndUpdate(
    {
      _id: rentalId,
      renter: ownerId,
      status: { $ne: 'cancelled' },
      'rentalPeriod.endDate': { $lt: completedBefore },
      'ownerReview.submittedAt': { $exists: false },
    },
    {
      $set: {
        ownerReview: { clientRating, submittedAt },
      },
    },
    { new: true, session: dbSession }
  ).lean();

  if (!updatedRental) throw new Error('REVIEW_ALREADY_SUBMITTED');

  const calculatedClientRating = await calculateUserRating(clientId, dbSession);

  await User.findByIdAndUpdate(clientId, calculatedClientRating, {
    session: dbSession,
  });

  return { clientRating, submittedAt };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authSession = await getServerSession(authOptions);

  if (!authSession?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!mongoose.isValidObjectId(params.id)) {
    return NextResponse.json({ message: 'Invalid rental ID' }, { status: 400 });
  }

  let body: ReviewRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: 'Invalid request body' },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    const rental = await Rental.findById(params.id)
      .select('car renter client rentalPeriod status clientReview ownerReview')
      .lean();

    if (!rental) {
      return NextResponse.json(
        { message: 'Rental not found' },
        { status: 404 }
      );
    }

    const userId = authSession.user.id;
    const isClient = rental.client.toString() === userId;
    const isOwner = rental.renter.toString() === userId;

    if (!isClient && !isOwner) {
      return NextResponse.json(
        { message: 'You cannot review this rental' },
        { status: 403 }
      );
    }

    const now = new Date();
    const completedBefore = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );

    if (
      rental.status === 'cancelled' ||
      new Date(rental.rentalPeriod.endDate).getTime() >=
        completedBefore.getTime()
    ) {
      return NextResponse.json(
        { message: 'Reviews are available after the rental is completed' },
        { status: 409 }
      );
    }

    let validatedReview: ValidatedReview;

    if (isClient) {
      if (!isRating(body.carRating) || !isRating(body.ownerRating)) {
        return NextResponse.json(
          {
            message: 'Car and owner ratings must be whole numbers from 1 to 5',
          },
          { status: 400 }
        );
      }

      validatedReview = {
        reviewer: 'client',
        carRating: body.carRating,
        ownerRating: body.ownerRating,
      };
    } else {
      if (!isRating(body.clientRating)) {
        return NextResponse.json(
          { message: 'Client rating must be a whole number from 1 to 5' },
          { status: 400 }
        );
      }

      validatedReview = {
        reviewer: 'owner',
        clientRating: body.clientRating,
      };
    }

    const dbSession = await mongoose.startSession();
    let submittedReview: SubmittedReview<Date> | undefined;

    try {
      await dbSession.withTransaction(async () => {
        if (validatedReview.reviewer === 'client') {
          submittedReview = await submitClientReview({
            rentalId: rental._id,
            carId: rental.car,
            ownerId: rental.renter,
            clientId: userId,
            carRating: validatedReview.carRating,
            ownerRating: validatedReview.ownerRating,
            completedBefore,
            dbSession,
          });
          return;
        }

        submittedReview = await submitOwnerReview({
          rentalId: rental._id,
          clientId: rental.client,
          ownerId: userId,
          clientRating: validatedReview.clientRating,
          completedBefore,
          dbSession,
        });
      });
    } finally {
      await dbSession.endSession();
    }

    return NextResponse.json(
      { message: 'Rating submitted', review: submittedReview },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'REVIEW_ALREADY_SUBMITTED'
    ) {
      return NextResponse.json(
        { message: 'You have already reviewed this rental' },
        { status: 409 }
      );
    }

    console.error('Failed to submit rental review:', error);
    return NextResponse.json(
      { message: 'Unable to submit rating' },
      { status: 500 }
    );
  }
}
