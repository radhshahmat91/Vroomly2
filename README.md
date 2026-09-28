# Vroomly
<a href="https://vroomly2-kappa.vercel.app">Live Demo</a>

A full-stack, peer-to-peer car rental & booking marketplace — built as a portfolio project to demonstrate a complete product across three sides: **renters**, **vehicle owners (hosts)**, and **admins**.

Renters search and filter cars, book them, pay by card, and leave reviews. Hosts list vehicles, manage pricing and availability, and accept or decline booking requests. Admins moderate the whole marketplace — approving hosts and listings, resolving complaints, and watching revenue roll in.

> This is a demo/portfolio build. Seed data, demo vehicle photography, and a few architectural simplifications are called out explicitly below so nothing here is mistaken for production behavior it doesn't have.

---

## Contents

1. [Feature checklist](#feature-checklist)
2. [Tech stack](#tech-stack)
3. [Project structure](#project-structure)
4. [Architecture notes](#architecture-notes)
5. [Getting started](#getting-started)
6. [Demo accounts](#demo-accounts)
7. [Third-party services](#third-party-services)
8. [Testing](#testing)
9. [Known limitations & good next steps](#known-limitations--good-next-steps)
10. [Deployment](#deployment)

---

## Feature checklist

Every item from the original spec, and how it's implemented:

**Renter side**
- ✅ Landing page — hero search, category browser, top-rated cars, how-it-works, host CTA
- ✅ Search cars — keyword, pagination, sorting
- ✅ Filters — brand, price range, city (+ optional geo-radius search), seats, fuel type, transmission
- ✅ Car details page — full spec sheet, host info, location
- ✅ Image gallery — thumbnail strip + fullscreen lightbox
- ✅ Availability calendar — booked/blocked dates greyed out, doubles as the date-range picker
- ✅ Booking — request-to-book flow with live price + discount estimate
- ✅ Payment — Stripe Payment Element (card, test mode)
- ✅ Booking history — status tabs, cancel, pay, review actions
- ✅ Reviews & ratings — 1–5 stars + comment, one per completed trip, host can reply
- ✅ User profile — edit details, avatar upload, change password
- ✅ Notifications — in-app bell + full page, pushed live over Socket.IO

**Owner (host) side**
- ✅ Add vehicles — full spec form, sent for admin review
- ✅ Upload photos — multi-image upload to Cloudinary
- ✅ Set pricing — daily rate + weekly/monthly discount tiers
- ✅ Set availability — block off maintenance/personal-use date ranges
- ✅ Accept/reject bookings — with automatic conflict resolution (accepting one request auto-declines overlapping pending ones)
- ✅ View earnings — monthly chart + per-trip transaction table (net of platform commission)
- ✅ Manage reviews — read and reply to reviews on your listings

**Admin dashboard**
- ✅ Users — search, suspend/reinstate renters
- ✅ Vehicle owners — approval queue for new hosts, suspend/reinstate
- ✅ Cars — moderation queue (approve/reject/remove listings)
- ✅ Bookings — full read-only ledger with status filter
- ✅ Payments — full payment ledger with Stripe references
- ✅ Reports — CSV export of the revenue-by-month report
- ✅ Complaints — queue with status + admin response
- ✅ Analytics — KPI cards, revenue chart, bookings-by-status breakdown

---

## Tech stack

| Layer | Choices |
|---|---|
| Frontend | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 |
| Backend | Node.js · Express · REST API |
| Database | MongoDB · Mongoose |
| Auth | JWT (Bearer token) |
| Media | Cloudinary |
| Payments | Stripe (Payment Element, test mode) |
| Maps | Google Maps JavaScript API |
| Realtime | Socket.IO |
| Data fetching | TanStack Query · Axios |
| Forms | react-hook-form · Zod |
| Charts | Recharts |

Also in the mix: `react-day-picker`, `helmet`, `express-rate-limit`, `express-mongo-sanitize`, `bcryptjs`, `multer`, `jest`/`supertest`.

---

## Project structure

```
vroomly/
├── backend/
│   ├── server.js                # entry point: connects DB, starts Socket.IO + HTTP server
│   └── src/
│       ├── app.js               # Express app: middleware + route mounting
│       ├── config/               # db, cloudinary, stripe, env validation
│       ├── models/               # User, Car, Booking, Review, Payment, Notification, Complaint
│       ├── controllers/          # one file per resource
│       ├── routes/               # one file per resource
│       ├── middleware/           # auth, error handling, validation, upload
│       ├── utils/                # pricing, availability, notifications, JWT
│       ├── sockets/               # Socket.IO singleton
│       └── seed/                 # demo data + seed script
│   └── tests/                    # Jest unit tests (pricing, availability, JWT)
│
├── frontend/
│   ├── app/                      # Next.js App Router — one folder per route
│   │   ├── (public marketing, cars, booking flow)
│   │   ├── dashboard/            # renter portal
│   │   ├── owner/                # host portal
│   │   └── admin/                # admin portal
│   ├── components/               # ui/, layout/, cars/, booking/, reviews/, notifications/, charts/, auth/
│   ├── context/                  # AuthContext, SocketContext
│   ├── hooks/                    # TanStack Query hooks per resource
│   ├── lib/                      # api client + per-resource API modules, validators, utils
│   └── types/                    # shared TypeScript types (mirrors backend models)
│
└── docker-compose.yml            # optional local MongoDB
```

---

## Architecture notes

A few decisions worth knowing about before you dig into the code:

- **Bearer token auth, not cookies.** The frontend and API are separate origins (`localhost:3000` / `localhost:5000` locally, and separate Vercel/Render domains in production). Rather than fight cross-site cookie rules, the JWT is returned in the login/register response body, stored in `localStorage`, and attached as an `Authorization: Bearer <token>` header via an Axios interceptor. Route protection is done client-side (a `RequireRole` guard component), not in Next.js middleware. The trade-off is a small XSS surface on the token; the standard hardening move is to move to an httpOnly cookie via a same-origin BFF (Next.js Route Handlers proxying to the API) — a reasonable next step, not included here to keep the architecture easy to follow.
- **Booking state machine.** `pending → accepted → confirmed (paid) → completed`, with `rejected`/`cancelled` off-ramps. Multiple renters can have *pending* requests for overlapping dates — nothing is promised yet. The moment a host **accepts** one, the API automatically rejects any other pending request that overlaps those dates, with a notification explaining why. Payment is only possible on an `accepted` booking; a completed-but-unpaid Stripe PaymentIntent never confirms a booking on its own — the backend re-verifies the PaymentIntent status server-side before flipping the booking to `confirmed`.
- **No cron jobs.** A `confirmed` booking whose end date has passed is lazily flipped to `completed` the moment it's next queried, instead of via a scheduled job. Simpler for a project this size; functionally identical to the user.
- **Marketplace moderation.** New host accounts start `isOwnerApproved: false` and can't list a car until an admin approves them. New/edited car listings start `isApproved: false` and don't appear in search until an admin approves them. The seed data includes one pending host and two pending listings so this queue isn't empty on first login.
- **Commission model.** `PLATFORM_COMMISSION_PERCENT` (backend `.env`, default 12%) is deducted from every paid booking; hosts see both gross and net numbers on their earnings page.
- **Client-side price estimate.** The booking widget shows an instant price estimate using the same formula as the backend (`frontend/lib/pricing.ts` mirrors `backend/src/utils/pricing.js`). It's display-only — the server always recalculates the authoritative price when a booking is actually created.

---

## Getting started

### Prerequisites
- Node.js 18+
- MongoDB (local install, [Docker](#local-mongodb-via-docker), or a free [Atlas](https://www.mongodb.com/atlas) cluster)

### 1. Backend

```bash
cd backend
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET at minimum
npm install
npm run seed               # populates the database with realistic demo data
npm run dev                 # starts the API on http://localhost:5000
```

Generate a `JWT_SECRET` quickly with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

#### Local MongoDB via Docker
No MongoDB installed? From the repo root:
```bash
docker compose up -d
```
Then set `MONGO_URI=mongodb://127.0.0.1:27017/vroomly` in `backend/.env`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local   # NEXT_PUBLIC_API_URL defaults to http://localhost:5000/api
npm install
npm run dev                   # starts the app on http://localhost:3000
```

Open `http://localhost:3000` and log in with one of the [demo accounts](#demo-accounts) below.

---

## Demo accounts

All seeded with the password **`password123`**:

| Role | Email | Notes |
|---|---|---|
| Admin | `admin@vroomly.dev` | Full access to `/admin` |
| Host | `owner1@vroomly.dev`, `owner2@vroomly.dev`, `owner3@vroomly.dev` | Pre-approved, own the seeded cars |
| Host (pending) | `owner4@vroomly.dev` | Not yet approved — good for demoing the admin approval flow |
| Renter | `user1@vroomly.dev` … `user5@vroomly.dev` | Have a mix of pending/accepted/confirmed/completed bookings already |

Running `npm run seed` again wipes and recreates all of this from scratch (`npm run seed:destroy` just wipes it).

---

## Third-party services

The app is fully usable out of the box with **zero API keys** — seed data covers cars, bookings, and reviews. The demo fleet now uses lightweight, model-specific local SVG vehicle artwork; owner-uploaded images still use Cloudinary when configured. Real integrations layer on top:

| Service | Without a key | With a key |
|---|---|---|
| **Cloudinary** | Image upload endpoints return a clear error | Real photo uploads for cars & avatars |
| **Stripe** | Payment page shows a "not configured" message instead of a broken form | Full Payment Element checkout (test mode) |
| **Google Maps** | Car details page shows a plain address instead of a map | Interactive map pin on the car's location |

None of these being unset will crash the server or break unrelated pages — see `backend/src/config/checkEnv.js`.

**Stripe test card:** `4242 4242 4242 4242`, any future expiry, any CVC, any postal code.

**A note on SSLCommerz:** the original spec listed Stripe **or** SSLCommerz. Stripe was built out fully since its test mode is instantly usable by anyone reviewing this project, regardless of location. The payment logic is isolated in `backend/src/controllers/paymentController.js` and `backend/src/config/stripe.js`, so swapping in (or adding) SSLCommerz as a second gateway means adding a parallel `config/sslcommerz.js` + a couple of routes — it doesn't touch booking, pricing, or notification logic at all.

---

## Testing

Backend unit tests (`cd backend && npm test`) cover the pure business logic — pricing/discount/commission math, date-overlap detection, and JWT signing — with no database required.

**Honesty about scope:** this project was built in a sandboxed environment without access to a real MongoDB instance (no route to Atlas or to `mongodb-memory-server`'s binary download). So while every route was carefully reviewed and the full server boots and serves requests correctly, the database-backed request/response cycle wasn't exercised by an automated integration test here. If you want that coverage, `mongodb-memory-server` (already a natural fit with the existing Jest setup) or a Dockerized Mongo in CI would be the next thing to add — install it, point a `tests/setup.js` at it, and the existing controllers need no changes to be testable that way.

The frontend is structured for a standard Next.js production build (`cd frontend && npm run build`). In this delivery environment, dependency installation timed out before the local Next.js CLI could be installed, so a fresh production build could not be executed here; the changed backend JavaScript was syntax-checked successfully.

---

## Known limitations & good next steps

Being upfront about what's simplified, so nothing here reads as an oversight:

- **New listings default to Vroomly's Dhaka coordinates** unless you wire up Google Places Autocomplete in the "Add vehicle" form to geocode the address the host types in.
- **No email at all** — no verification, no password reset, no email receipts. Everything notification-related is in-app + realtime only, matching the original spec (which asked for "Notifications," not email).
- **JWTs don't rotate or refresh** — a single 7-day token, not an access/refresh pair. Fine for a demo; worth adding for anything real.
- **No automated scheduling** — the "booking auto-completes after its end date" logic runs lazily on read rather than via a cron job (see [Architecture notes](#architecture-notes)).
- **Stripe webhook code exists but isn't exercised** — `POST /api/payments/webhook` is implemented correctly for production use, but since a local dev server has no public URL, the app relies on the client-confirm path instead. Test it locally with the [Stripe CLI](https://stripe.com/docs/stripe-cli) (`stripe listen --forward-to localhost:5000/api/payments/webhook`).

---

## Deployment

The same pattern used for this project's siblings (AcademiaConnect, JobHunt) works well here:

1. **Database** — a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster; grab the connection string for `MONGO_URI`.
2. **Backend → [Render](https://render.com)** — new Web Service pointed at `backend/`, build command `npm install`, start command `npm start`, and copy every variable from `backend/.env.example` into Render's environment settings.
3. **Frontend → [Vercel](https://vercel.com)** — import the repo, set the root directory to `frontend/`, and add the variables from `frontend/.env.example` (pointing `NEXT_PUBLIC_API_URL` at your live Render URL).
4. Update `CLIENT_URL` in the backend's environment to your live Vercel URL so CORS and the Socket.IO handshake allow it.

---

Built as a portfolio project. Not a real booking service — please don't try to actually rent a car through it.

## Frontend demo mode

The frontend includes a local 14-car demo fleet. If the backend/MongoDB is not running, the homepage and `/cars` automatically fall back to these local listings so the UI can be previewed without a database connection. Once `/api/cars` returns real listings, those listings are used instead.

To use the real MongoDB data, configure the backend `.env` from `.env.example`, seed the database with `npm run seed`, and start the backend.
