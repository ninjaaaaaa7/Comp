# Companio backend migration checklist

Each step is independently deployable. The frontend keeps running on
`NEXT_PUBLIC_DATA_CLIENT=local` until you deliberately flip the flag.

---

## Step 1 — Install packages

```bash
npm i prisma @prisma/client next-auth razorpay zod
npx prisma generate          # generates the typed PrismaClient from schema.prisma
```

---

## Step 2 — Provision Neon + run first migration

1. Create a Neon project → copy the pooled and direct connection strings into `.env`.
2. Run:

```bash
npx prisma migrate dev --name init
```

This creates all tables defined in `prisma/schema.prisma`.

---

## Step 3 — Seed companions from mock data

Create `prisma/seed.ts` that imports `COMPANIONS` from `lib/data/companions`
and upserts each record:

```ts
import { PrismaClient } from '@prisma/client';
import { COMPANIONS } from '../lib/data/companions';

const prisma = new PrismaClient();

async function main() {
  for (const c of COMPANIONS) {
    await prisma.companion.upsert({
      where: { id: c.id },
      update: {},
      create: {
        ...c,
        reviewCount: c.reviews,
        reviewsList: c.reviewsList,
      },
    });
  }
}

main().finally(() => prisma.$disconnect());
```

Add to `package.json`:

```json
"prisma": { "seed": "ts-node prisma/seed.ts" }
```

Run: `npx prisma db seed`

---

## Step 4 — Implement real API routes

For each resource (wallet, bookings, messages, notifications, favorites,
application, subscription) create a route file under `app/api/`.

Each route should:
- Authenticate the session with Auth.js `getServerSession()`
- Validate the request body with `zod`
- Read/write via `PrismaClient` (import from `@prisma/client`)
- Return typed JSON matching the shapes in `lib/dataClient.ts`

The `httpDataClient` stubs in `lib/dataClient.ts` already have the correct
paths (`/api/wallet`, `/api/bookings`, etc.) — implement the routes to match.

---

## Step 5 — Wire Auth.js

1. Create `app/api/auth/[...nextauth]/route.ts`.
2. Choose a provider (Google OAuth for email users, or a custom Credentials
   provider for phone-OTP via SMS gateway).
3. Use the database adapter: `@auth/prisma-adapter` with the `PrismaClient`.
4. The `User` model in `schema.prisma` is already compatible with the
   Auth.js Prisma adapter shape (add `emailVerified DateTime?`, `image String?`
   if using the adapter's managed tables).

---

## Step 6 — Razorpay order → verify → webhook

Flow:
1. `POST /api/razorpay/create-order` — server creates a Razorpay order, stores
   `razorpayOrderId` on the pending Booking row.
2. Client completes payment in the Razorpay checkout widget.
3. `POST /api/razorpay/verify` — server verifies the HMAC-SHA256 signature
   (`razorpay_order_id + "|" + razorpay_payment_id`, signed with `RAZORPAY_KEY_SECRET`).
4. On success: update `Booking.status = completed`, write a `CreditLedger` row,
   update `Wallet.credits`.
5. `POST /api/razorpay/webhook` — Razorpay server-to-server confirmation.
   Verify with `RAZORPAY_WEBHOOK_SECRET`. Idempotent: check if booking is already
   completed before writing. Handles refunds and failures.

Never credit a user until the webhook *and* the verify step agree.

---

## Step 7 — Flip the flag + migrate call sites

1. Set `NEXT_PUBLIC_DATA_CLIENT=http` in `.env` (and in Vercel env vars).
2. Redeploy. The `dataClient` singleton in `lib/dataClient.ts` now uses
   `httpDataClient` everywhere with zero component changes.
3. Smoke test each feature: explore, booking, chat, notifications, plan.
4. Once confirmed stable, delete the `localStorageDataClient` implementation
   and the `local` branch in `lib/dataClient.ts`.

---

## Key files added in this foundation stage

| File | Purpose |
|---|---|
| `prisma/schema.prisma` | Full Postgres schema, safe to have pre-install |
| `lib/dataClient.ts` | DataClient interface + localStorage impl + http stubs |
| `app/api/companions/route.ts` | Working GET endpoint (mock data, no DB) |
| `app/api/health/route.ts` | Health-check endpoint |
| `.env.example` | Documents all required env vars |
