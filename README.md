# RentMyCar

RentMyCar is a full-stack peer-to-peer car rental marketplace built as a portfolio project. It allows car owners to publish and manage their vehicles, while renters can search for available cars, book them for selected dates, and manage their reservations.

The project focuses on clear user flows, responsive desktop and mobile experiences, secure authorization, and reliable booking availability.

## Features

### Authentication and profiles

- Account registration with email verification
- Credentials-based authentication with JWT sessions
- Password hashing with bcrypt
- Personal and public user profiles
- Profile editing and image management
- Protected routes and authenticated API endpoints

### Vehicle management

- Add a vehicle with specifications, location, price, and images
- View all vehicles published by the signed-in owner
- Update or delete owned vehicles
- Separate responsive experiences for desktop and mobile devices

### Search and booking

- Search by rental dates and city
- Filter by price, manufacturer, vehicle type, and engine type
- Paginated search results
- Exclusion of unavailable vehicles for overlapping dates
- Prevention of booking your own vehicle
- Atomic availability check to reduce double-booking risk
- Automatic total-price calculation

### Rentals and notifications

- View personal rentals
- Cancel an existing reservation
- Booking and cancellation email notifications for renters and owners
- Ethereal email previews during local development when SMTP credentials are not configured

### User experience

- Responsive desktop and mobile components
- Accessible headless UI primitives built with Radix UI
- Progressive Web App support and offline caching
- Loading, empty, validation, and error states across the main flows

## Tech stack

| Area                | Technologies                                   |
| ------------------- | ---------------------------------------------- |
| Framework           | Next.js 14, React 18, App Router               |
| Language            | TypeScript                                     |
| Database            | MongoDB, Mongoose                              |
| Authentication      | NextAuth.js, JWT, Credentials provider, bcrypt |
| Styling             | Tailwind CSS, Class Variance Authority         |
| UI                  | Radix UI, Lucide React, Material UI icons      |
| Validation          | React Hook Form, Zod                           |
| Email               | Nodemailer                                     |
| Images              | Next.js Image, Sharp                           |
| PWA                 | next-pwa                                       |
| Deployment insights | Vercel Analytics, Vercel Speed Insights        |

## Architecture

The application uses the Next.js App Router and keeps business operations behind API Route Handlers.

```text
app/
  (auth)/          Authentication pages
  api/             API Route Handlers
  cars/            Vehicle listing and management pages
  profile/         Personal and public profile pages
components/
  UI/              Reusable UI components
  mobile/          Mobile-specific components
hooks/             Reusable client-side behavior
lib/
  db/              Cached database connection
  emailService/    Transactional email logic
  model/           Mongoose models and domain types
utils/             Shared utility functions
```

MongoDB connections are cached and reused between requests. Authentication uses NextAuth JWT sessions, and endpoints that access or modify private resources verify the current session and resource ownership.

## Getting started

### Prerequisites

- Node.js 20 or newer
- npm
- A local or hosted MongoDB database

### Installation

1. Clone the repository:

   ```powershell
   git clone https://github.com/stefan-lukic/rent-my-car-app.git
   cd rent-my-car-app
   ```

2. Install dependencies:

   ```powershell
   npm install
   ```

3. Create a local environment file from the example:

   ```powershell
   Copy-Item .env.example .env.local
   ```

4. Fill in the required environment variables in `.env.local`.

5. Start the development server:

   ```powershell
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable                       | Purpose                                             |
| ------------------------------ | --------------------------------------------------- |
| `MONGODB_URI`                  | MongoDB connection string                           |
| `NEXTAUTH_SECRET`              | Secret used to sign authentication tokens           |
| `NEXTAUTH_URL`                 | Canonical URL used by NextAuth                      |
| `APP_URL`                      | Base URL used to create links in emails             |
| `SMTP_HOST`                    | SMTP server hostname                                |
| `SMTP_PORT`                    | SMTP server port                                    |
| `SMTP_SECURE`                  | Whether the SMTP connection uses TLS from the start |
| `SMTP_USER`                    | SMTP username                                       |
| `SMTP_PASSWORD`                | SMTP password                                       |
| `EMAIL_FROM`                   | Sender displayed in transactional emails            |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Public key for web push subscriptions               |
| `VAPID_PRIVATE_KEY`            | Private key for web push messages                   |

Never commit real credentials. Local `.env` files are ignored by Git; `.env.example` contains placeholders only.

## Available scripts

```powershell
npm run dev      # Start the development server
npm run build    # Create a production build
npm run start    # Run the production build
npm run lint     # Run ESLint
```

## Security considerations

- Passwords are hashed before storage.
- Email verification and password-reset tokens are cryptographically random and stored as hashes.
- Private API endpoints require an authenticated session.
- Vehicle mutations verify ownership on the server.
- Booking availability is checked on the server, including an atomic vehicle update to reduce concurrent double bookings.
- Public API responses should expose only explicitly selected profile fields.
- User-provided values included in HTML emails are escaped.

## Roadmap

- Complete the password-reset flow with a dedicated reset page and endpoint
- Expand API validation with shared Zod schemas
- Complete automated component, hook, utility, and API test integration
- Persist and deliver web push subscriptions
- Add rate limiting to authentication and email endpoints
- Complete a dependency and security hardening pass
- Add a hosted demo and product screenshots

## Project status

RentMyCar is under active development. It is a portfolio application and is not currently intended to process real payments or production rental agreements.

## Author

Developed by [Srdjan Vasic](https://github.com/cpku21).

Mentored and code-reviewed by [Stefan Lukic](https://github.com/stefan-lukic).
