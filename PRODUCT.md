# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are car owners and renters using a web app to list vehicles, search for available cars, and complete bookings in a shared marketplace. Owners need to publish and manage their vehicles; renters need to find a suitable car for selected dates and manage reservations.

## Product Purpose

RentMyCar is a peer-to-peer car rental marketplace built as a portfolio project. It allows car owners to publish and manage vehicles while enabling renters to search, compare, and reserve cars for selected dates. Success means owners can list vehicles with confidence and renters can discover a trusted booking option without overlapping availability or ambiguous ownership.

## Positioning

The product positions itself as a local, peer-to-peer alternative to traditional car rental providers: owners make vehicles available for rent and renters book directly from those listings. The product is not a fleet-management system, a B2B rental platform, or a payment-processing product; it is a marketplace experience centered on booking and trust.

## Operating Context

The product is a Next.js web application using the App Router and a MongoDB-backed backend. Core workflows occur in authenticated account, vehicle management, search, reservation, and notification flows. Users work in browser-based sessions and interact with responsive desktop and mobile layouts, live booking availability checks, and transactional email flows during registration, booking, and cancellation.

## Capabilities and Constraints

- User registration with email verification and credentials-based authentication
- JWT-based sessions and protected private endpoints
- Personal and public profile management, including image handling
- Vehicle publishing, edit, and deletion flows for the signed-in owner
- Search by rental dates and city with filters for price, manufacturer, vehicle type, and engine type
- Paginated search results that exclude unavailable cars for overlapping dates
- Booking logic that prevents self-booking and reduces concurrent double-booking risk
- Automatic total-price calculation before confirmation
- Personal rental management and cancellation
- Booking and cancellation email notifications for both renters and owners
- Responsive experience across desktop and mobile screens
- Progressive Web App support and offline caching
- Development environment relies on a local or hosted MongoDB database and SMTP configuration for transactional emails
- The project is intentionally a portfolio application and not a production rental agreement or payment-processing system

## Brand Commitments

The existing product name is RentMyCar. The project explicitly presents itself as a portfolio application and is designed to be clear, trustworthy, and polished for a user-facing marketplace experience. RentMyCar has an existing blue-based visual identity that must be preserved and refined rather than replaced. No additional brand system, voice guidelines, or legal identity commitments are documented beyond that.

## Evidence on Hand

- README.md in the repository describes the product, core features, tech stack, architecture, and project status
- package.json confirms the project is a Next.js TypeScript application with MongoDB, NextAuth, Tailwind, Radix UI, and PWA support
- app/ and components/ show a routed web application with authentication, vehicle, profile, and booking flows
- .env.example documents the environment variables required for database, auth, and email configuration

## Product Principles

1. Trust first: private data, ownership, and booking decisions must remain secure and explicit.
2. Availability clarity: booking flows should surface valid inventory and prevent conflicts.
3. Simple marketplace operations: owners and renters should be able to complete core tasks with minimal friction.
4. Responsive access: the experience must work across desktop and mobile contexts without losing key functionality.
5. Product maturity without operational scale: the app demonstrates a production-minded flow without pretending to handle real-world contractual or payment obligations.

## Accessibility & Inclusion

The product uses accessible UI primitives from Radix and includes loading, empty, validation, and error states across main flows. No additional product-specific accessibility requirements are documented beyond maintaining a standard, inclusive web experience.
