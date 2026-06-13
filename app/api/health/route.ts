// app/api/health/route.ts
//
// GET /api/health
// Used by uptime monitors and the Vercel deploy check to confirm the API
// layer is responding. Returns {ok, time, env} — env is the DATA_CLIENT
// mode so you can verify the flag is set correctly in production.
//
// When a real DB is wired, add a lightweight prisma.$queryRaw`SELECT 1` probe
// here and surface db: 'ok' | 'error' in the response.

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // must not be cached

export async function GET() {
  return NextResponse.json({
    ok: true,
    time: new Date().toISOString(),
    env: process.env.NEXT_PUBLIC_DATA_CLIENT ?? 'local',
  });
}
