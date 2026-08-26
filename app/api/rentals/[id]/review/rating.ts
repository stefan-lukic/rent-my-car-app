import mongoose from 'mongoose';
import Rental from '@/lib/model/Rental';

export type ReviewRequestBody = {
  carRating?: unknown;
  ownerRating?: unknown;
  clientRating?: unknown;
};

export type DatabaseId = {
  toString(): string;
};

type RatingSummary = {
  rating: number;
  ratingCount: number;
};

type AverageAggregationResult = {
  average?: number;
  count?: number;
};

export function isRating(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 5
  );
}

export function calculateAverageRating(
  result: AverageAggregationResult[]
): RatingSummary {
  return {
    rating: Number((result[0]?.average ?? 0).toFixed(1)),
    ratingCount: result[0]?.count ?? 0,
  };
}

export async function calculateUserRating(
  userId: DatabaseId,
  dbSession: mongoose.ClientSession
): Promise<RatingSummary> {
  const [ratingsAsOwner, ratingsAsClient] = await Promise.all([
    Rental.aggregate([
      {
        $match: {
          renter: userId,
          'clientReview.ownerRating': { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$clientReview.ownerRating' },
          count: { $sum: 1 },
        },
      },
    ]).session(dbSession),
    Rental.aggregate([
      {
        $match: {
          client: userId,
          'ownerReview.clientRating': { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$ownerReview.clientRating' },
          count: { $sum: 1 },
        },
      },
    ]).session(dbSession),
  ]);

  const total =
    (ratingsAsOwner[0]?.total ?? 0) + (ratingsAsClient[0]?.total ?? 0);
  const ratingCount =
    (ratingsAsOwner[0]?.count ?? 0) + (ratingsAsClient[0]?.count ?? 0);

  return {
    rating: ratingCount ? Number((total / ratingCount).toFixed(1)) : 0,
    ratingCount,
  };
}
