export type ReviewTimestamp = string | Date;

export type ClientReview<Timestamp = ReviewTimestamp> = {
  carRating: number;
  ownerRating: number;
  submittedAt: Timestamp;
};

export type OwnerReview<Timestamp = ReviewTimestamp> = {
  clientRating: number;
  submittedAt: Timestamp;
};

export type SubmittedReview<Timestamp = ReviewTimestamp> =
  | ClientReview<Timestamp>
  | OwnerReview<Timestamp>;
