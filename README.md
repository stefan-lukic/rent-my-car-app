# RentMyCar

[Live demo](https://rent-my-car-app.vercel.app/) | [Browse the code](https://github.com/stefan-lukic/rent-my-car-app)

RentMyCar is a peer-to-peer car rental **demo for Serbia**. People looking for a car can compare local listings, check availability and make a reservation; owners can publish vehicles and manage incoming bookings. It is a portfolio project, not a production-ready rental business: the app does **not** process payments or deposits, provide insurance, or arrange vehicle handover.

The same account can be used to rent a car and to list one. The interface has dedicated desktop and mobile views, and the app can be installed as a PWA.

## What you can do

| As a renter                                                                                                    | As an owner                                                                                |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Search available cars by dates and city; filter by price, make, type, engine and minimum seats.                | Publish a car with its specifications, photos, location and daily price.                   |
| Open a public car detail page, see photos and specifications, and return to the search with filters preserved. | Edit or remove your own listing and review incoming reservations in your profile.          |
| Book a car, see the calculated total, follow the reservation status and leave a review after a rental.         | Cancel an upcoming booking until its start time, including when less than 24 hours remain. |
| Cancel at least 24 hours before the rental starts; cancelled bookings stay in history.                         | See the customer's contact details only while a reservation is active.                     |

Accounts use email verification and password-based sign-in. Users can reset a forgotten password and edit their profiles. Booking and cancellation emails are sent when SMTP is configured. Google sign-up is visible but disabled and marked "Coming soon"; it is **not** an available sign-in method.

### Booking and privacy rules

- The server rejects bookings for your own car, unavailable dates and overlapping active reservations made by the same customer. Booking and cancellation update the rental and the car's reserved periods together in MongoDB transactions.
- A renter can cancel at least 24 hours before pickup. The car owner can cancel until the rental starts. Cancelling releases the dates but keeps the booking in history and records who cancelled it.
- Public car pages show the city, not the precise pickup address. Contact and pickup details are restricted to the appropriate active reservation.
- The price shown in the app is an estimate based on the daily listing price and selected period. Payment, deposit, insurance and handover arrangements happen outside the app between users.

## Tech stack

| Area                 | Technology                                             |
| -------------------- | ------------------------------------------------------ |
| Frontend and server  | Next.js 14 App Router, React 18, TypeScript            |
| Database             | MongoDB, Mongoose                                      |
| Authentication       | NextAuth.js credentials provider, JWT sessions, bcrypt |
| Forms and validation | React Hook Form, Zod                                   |
| UI                   | Tailwind CSS, Radix UI, Lucide React                   |
| Email                | Nodemailer / SMTP                                      |
| PWA                  | next-pwa, web app manifest and install icons           |
| Tests                | Vitest, React Testing Library                          |
| Monitoring           | Vercel Analytics and Speed Insights                    |

### How it is organised

```text
app/                 Pages, layouts and API route handlers
  (auth)/            Sign-in, sign-up, email verification and password reset
  api/               Authentication, cars, bookings, profiles and rentals
  cars/              Search results, car details and add-car page
  profile/           Personal and public profiles
components/          Shared and desktop UI
  mobile/            Mobile-specific UI where the layout differs
  UI/                Reusable controls
helper/              Interface copy
hooks/               Client-side hooks
lib/                 Auth, database, models, email and booking helpers
types/               Shared TypeScript types
```

Search runs through `GET /api/cars`: the server applies filters and availability checks, selects only card fields and paginates the results in MongoDB. Car details are public; creating a booking requires a signed-in account. Mutating routes also check authorization and resource ownership on the server, so hiding a button is never the only protection.

### Engineering decisions worth exploring

- **Concurrent bookings:** the booking handler checks the customer's active rentals and reserves the car inside a transaction. An atomic car update prevents two requests from claiming the same dates; cancellation removes that reservation in the same transaction as the rental status change.
- **Session revocation:** a password reset increments the user's session version. Server-side session reads compare it with the version stored in the JWT, so older sessions are rejected.
- **Public vs. private data:** search returns a small card-shaped response, while car details remain public. Server-side authorization controls owner actions and access to reservation contact data.
- **PWA caching:** static assets can be cached, but authenticated pages and API responses are not treated as public offline content.

## Run locally

You need Node.js 20+, npm and MongoDB. Booking and cancellation use MongoDB transactions, so the database must support them: use MongoDB Atlas or a local replica set rather than a standalone MongoDB instance.

```bash
git clone https://github.com/stefan-lukic/rent-my-car-app.git
cd rent-my-car-app
npm install
```

Copy `.env.example` to `.env.local` and replace its placeholders with your own values. On Windows PowerShell, use `Copy-Item .env.example .env.local`; on macOS/Linux, use `cp .env.example .env.local`. At minimum, configure `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` and `APP_URL`. Then run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `NEXTAUTH_URL` and `APP_URL` should both point to that address locally; in a deployment, set them to the deployed origin. Never commit `.env.local` or real credentials.

### Environment variables

| Variable                                                                            | Used for                                        |
| ----------------------------------------------------------------------------------- | ----------------------------------------------- |
| `MONGODB_URI`                                                                       | MongoDB connection                              |
| `NEXTAUTH_SECRET`, `NEXTAUTH_URL`                                                   | NextAuth token secret and canonical URL         |
| `APP_URL`                                                                           | Links in verification and password-reset emails |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM` | Transactional email via your SMTP provider      |
| `NEXT_GOOGLE_MAPS_PLACES_API_KEY`                                                   | Google Places autocomplete on car forms         |
| `NEXT_GOOGLE_MAPS_EMBED_API_KEY`                                                    | Google Maps embed on car details                |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`                                 | Optional web-push setup                         |

The Google Maps/Places keys and web-push keys are optional for the main booking flow. Without configured SMTP credentials, the email service uses an Ethereal test inbox: it logs preview links locally, but **does not deliver real email**. To test actual delivery, configure a real SMTP provider. Restrict Google API keys by API and allowed origin before deploying.

## Quality checks

```bash
npm run typecheck  # TypeScript
npm run lint       # ESLint
npm test           # Vitest
npm run build      # Production build
```

Tests cover UI components and important API/business flows, including booking and cancellation. A green test run is not a substitute for trying the full flow in a browser on both desktop and mobile.

## Current limits and next steps

This is deliberately a **portfolio/demo marketplace**. There is no integrated payment or deposit collection, insurance verification, dispute handling, roadside support, or completed Google OAuth. Do not treat an in-app reservation as a completed real-world rental agreement.

Car photos are currently stored as image data rather than dedicated thumbnail URLs. Search limits the fields and number of images returned, but moving photos to object storage and serving optimized thumbnails remains a worthwhile performance improvement. Real-world launch would also require identity/driver checks, an operational support process and clear payment/insurance responsibilities.

## Author

Developed by [Srdjan Vasic](https://github.com/cpku21). Mentored and code-reviewed by [Stefan Lukic](https://github.com/stefan-lukic).
