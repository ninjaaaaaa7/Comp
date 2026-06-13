// Demo app state beyond the core journey keys — bookings, favourites,
// messages, notifications, credits top-ups, membership. All client-side,
// SSR-safe, pure functions (no React). Companion ids reference
// lib/data/companions. Wallet credits live in lib/journeyState (getWallet);
// addCredits below tops that same wallet up.

import { readJSON, writeJSON, canUseStorage } from './storage';
import { getWallet } from './journeyState';

const KEY_BOOKINGS = 'companio_bookings';
const KEY_FAVES = 'companio_favorites';
const KEY_MESSAGES = 'companio_messages';
const KEY_NOTIFS = 'companio_notifications';
const KEY_PLAN = 'companio_plan';
const KEY_APPLICATION = 'companio_companion_application';

// ── Bookings ─────────────────────────────────────────────────────────────────

export interface Booking {
  id: string;
  companionId: string;
  activity: string;
  dateISO: string; // meeting date, e.g. '2026-06-15'
  time: string; // display slot, e.g. 'Morning · 7–9 AM'
  place: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  usedCredit: boolean;
  pricePaid: number; // 0 when a credit was used
  review?: { stars: number; text: string };
  createdAt: number; // epoch ms
}

export function getBookings(): Booking[] {
  return readJSON<Booking[]>(KEY_BOOKINGS, []);
}

export function addBooking(b: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking {
  const all = getBookings();
  const booking: Booking = {
    ...b,
    id: `bk_${all.length + 1}_${b.companionId}`,
    status: 'upcoming',
    createdAt: Date.now(),
  };
  writeJSON(KEY_BOOKINGS, [...all, booking]);
  return booking;
}

export function updateBooking(id: string, patch: Partial<Booking>): void {
  writeJSON(
    KEY_BOOKINGS,
    getBookings().map((b) => (b.id === id ? { ...b, ...patch } : b)),
  );
}

// ── Favourites ───────────────────────────────────────────────────────────────

export function getFavorites(): string[] {
  return readJSON<string[]>(KEY_FAVES, []);
}

export function toggleFavorite(companionId: string): string[] {
  const cur = getFavorites();
  const next = cur.includes(companionId)
    ? cur.filter((x) => x !== companionId)
    : [...cur, companionId];
  writeJSON(KEY_FAVES, next);
  return next;
}

// ── Messages (one thread per companion) ──────────────────────────────────────

export interface ChatMessage {
  id: string;
  from: 'me' | 'them';
  text: string;
  ts: number;
}

type ThreadMap = Record<string, ChatMessage[]>;

export function getThread(companionId: string): ChatMessage[] {
  return readJSON<ThreadMap>(KEY_MESSAGES, {})[companionId] ?? [];
}

export function getThreads(): ThreadMap {
  return readJSON<ThreadMap>(KEY_MESSAGES, {});
}

export function appendMessage(companionId: string, msg: Omit<ChatMessage, 'id' | 'ts'>): ChatMessage {
  const map = getThreads();
  const thread = map[companionId] ?? [];
  const full: ChatMessage = { ...msg, id: `m_${companionId}_${thread.length + 1}`, ts: Date.now() };
  writeJSON(KEY_MESSAGES, { ...map, [companionId]: [...thread, full] });
  return full;
}

// ── Notifications ────────────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  ts: number;
  read: boolean;
}

export function getNotifications(): AppNotification[] {
  return readJSON<AppNotification[]>(KEY_NOTIFS, []);
}

export function addNotification(n: Pick<AppNotification, 'title' | 'body'>): void {
  const all = getNotifications();
  writeJSON(KEY_NOTIFS, [
    { ...n, id: `n_${all.length + 1}`, ts: Date.now(), read: false },
    ...all,
  ]);
}

export function markNotificationsRead(): void {
  writeJSON(KEY_NOTIFS, getNotifications().map((n) => ({ ...n, read: true })));
}

// ── Credits top-up + membership ──────────────────────────────────────────────

/** Adds purchased meetup credits to the journeyState wallet. */
export function addCredits(count: number): void {
  const w = getWallet();
  writeJSON('companio_wallet', { credits: w.credits + count, used: w.used });
}

export type Plan = 'plus' | null;

export function getPlan(): Plan {
  if (!canUseStorage()) return null;
  return localStorage.getItem(KEY_PLAN) === 'plus' ? 'plus' : null;
}

export function setPlan(p: Plan): void {
  if (!canUseStorage()) return;
  if (p) localStorage.setItem(KEY_PLAN, p);
  else localStorage.removeItem(KEY_PLAN);
}

// ── Companion application (become-a-companion wizard) ────────────────────────

export interface CompanionApplication {
  name: string;
  city: string;
  activities: string[];
  rate: number;
  bio: string;
  /** Mock verification flags ticked during the wizard. */
  idUploaded: boolean;
  backgroundConsent: boolean;
  status: 'draft' | 'submitted';
}

export function getApplication(): CompanionApplication | null {
  return readJSON<CompanionApplication | null>(KEY_APPLICATION, null);
}

export function saveApplication(a: CompanionApplication): void {
  writeJSON(KEY_APPLICATION, a);
}
