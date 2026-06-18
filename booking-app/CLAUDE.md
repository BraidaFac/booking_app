# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `booking-app/` directory.

```bash
npm run dev       # Start dev server at localhost:4321
npm run build     # Production build
npm run preview   # Preview production build locally
```

Prisma client is auto-generated on `postinstall`. If schema changes, run:
```bash
npx prisma generate
```

## Tech Stack

- **Astro 3** (SSR, `output: "server"`) + **React 18** (client components via `client:only="react"`)
- **MongoDB** via **Prisma 5** ORM
- **Lucia Auth v2** with Prisma adapter — session-based authentication
- **Tailwind CSS** + **DaisyUI** (theme: `lemonade`) for styling
- **Zustand** for client-side state; **date-fns** for date handling
- Deployed to **Vercel** via `@astrojs/vercel/serverless`

## Architecture

### Auth Flow

Lucia auth is initialized in `src/lib/lucia.ts` and injected globally by `src/middleware.ts` into `context.locals.auth`. Every protected page/API calls `locals.auth.validate()` and redirects to `/login` on null session.

User attributes surfaced by Lucia: `username`, `flat`, `floor`, `role` (`ADMIN | USER`).

### Data Model

Key Prisma models (MongoDB):
- **User** — `username` (unique), `flat`, `floor`, `role`
- **Booking** — `shift` (`MORNING | EVENING`), `booking_date`, `user_id`, `shared`; unique constraint on `(booking_date, shift)` — one booking per shift per day building-wide
- **Session / Key** — Lucia internals; cascade-delete on user removal
- **Password_reset_token** — custom token for password recovery flow

### API Routes (`src/pages/api/`)

All routes follow Astro's file-based API pattern (export `GET`, `POST`, `DELETE`, etc.):

| Route | Method | Purpose |
|---|---|---|
| `/api/booking` | GET | Fetch all future bookings with user info |
| `/api/booking` | POST | Create booking (`user_id`, `booking_date`, `shift`, `shared`) |
| `/api/booking/[id]` | DELETE | Delete own booking (validates ownership; 403 if not owner) |
| `/api/auth/*` | — | Register, login, logout |
| `/api/password/*` | — | Password reset request and token verification |
| `/api/user/[user]` | — | User profile management |

Business logic lives in `src/lib/*.controller.ts` files, not in the route handlers directly.

### Component Pattern

React components in `src/components/` are all client-only. The main page (`src/pages/index.astro`) renders them with `client:only="react"`.

- **BookingContainer.jsx** — fetches `/api/booking`, maps response, exposes imperative refresh handle
- **Calendar.jsx** — booking calendar UI; triggers booking creation
- **ModalShift.jsx** — shift selection (`MORNING`/`EVENING`) modal
- **MyBookingContainer.jsx** — filtered view of the current user's bookings
- **Booking.jsx** — single booking row/card

`useLoadingState` (Zustand store in `src/lib/loading_state.ts`) coordinates loading UI across components.

### Environment Variables

Requires a `.env` file with:
```
DATABASE_URL=   # MongoDB connection string
```
