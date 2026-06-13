// app/api/companions/route.ts
//
// GET /api/companions
// Returns the full companion catalogue as JSON. Today this reads from the
// static mock data in lib/data/companions. When DATABASE_URL is live,
// replace the import with a Prisma query — the response shape stays identical.
//
// No auth required for browse (matches current UI behaviour).
// Add ?city=mumbai filter param once multi-city DB rows exist.

import { NextResponse } from 'next/server';
import { COMPANIONS } from '@/lib/data/companions';

export const dynamic = 'force-dynamic'; // never cache at CDN edge

export async function GET() {
  // Future: const companions = await prisma.companion.findMany({ where: { city } });
  return NextResponse.json(COMPANIONS);
}
