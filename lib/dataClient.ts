// lib/dataClient.ts
//
// DATA-ACCESS SEAM — the single import boundary between UI and storage.
//
// Why this exists: right now everything reads directly from localStorage via
// lib/journeyState + lib/appState. When we wire a real DB the switch should
// be a one-line env-flag change, not a grep-and-replace across 30 components.
//
// Pattern:
//   DataClient (typed interface)
//     ├── localStorageDataClient  ← today, wraps existing sync fns with Promise.resolve()
//     └── httpDataClient          ← future, fetch('/api/...') calls (stubs only)
//
// Components import `dataClient` (the chosen singleton) and call await dc.getWallet().
// Nothing in this file imports @prisma/client or next-auth — those live in API routes.

import type { Wallet, DemoUser, QuizResult } from './journeyState';
import type {
  Booking,
  ChatMessage,
  AppNotification,
  Plan,
  CompanionApplication,
} from './appState';
import type { Companion } from './data/companions';

// ── DataClient interface ──────────────────────────────────────────────────────

export interface DataClient {
  // ── Companion catalogue ──────────────────────────────────────────────────
  getCompanions(): Promise<Companion[]>;
  getCompanion(id: string): Promise<Companion | undefined>;

  // ── Wallet / credits ──────────────────────────────────────────────────────
  getWallet(): Promise<Wallet>;
  addCredits(count: number): Promise<Wallet>;
  decrementMeeting(): Promise<Wallet>;

  // ── Unlock flag ───────────────────────────────────────────────────────────
  getUnlocked(): Promise<boolean>;
  setUnlocked(v: boolean): Promise<void>;

  // ── Welcomed flag ─────────────────────────────────────────────────────────
  getWelcomed(): Promise<boolean>;
  setWelcomed(v: boolean): Promise<void>;

  // ── User profile ──────────────────────────────────────────────────────────
  getUser(): Promise<DemoUser | null>;
  setUser(u: DemoUser): Promise<void>;

  // ── Bookings ──────────────────────────────────────────────────────────────
  getBookings(): Promise<Booking[]>;
  addBooking(b: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking>;
  updateBooking(id: string, patch: Partial<Booking>): Promise<void>;

  // ── Favorites ─────────────────────────────────────────────────────────────
  getFavorites(): Promise<string[]>;
  toggleFavorite(companionId: string): Promise<string[]>;

  // ── Messages ──────────────────────────────────────────────────────────────
  getThread(companionId: string): Promise<ChatMessage[]>;
  appendMessage(
    companionId: string,
    msg: Omit<ChatMessage, 'id' | 'ts'>,
  ): Promise<ChatMessage>;

  // ── Notifications ─────────────────────────────────────────────────────────
  getNotifications(): Promise<AppNotification[]>;
  addNotification(n: Pick<AppNotification, 'title' | 'body'>): Promise<void>;

  // ── Plan / subscription ───────────────────────────────────────────────────
  getPlan(): Promise<Plan>;
  setPlan(p: Plan): Promise<void>;

  // ── Companion application ─────────────────────────────────────────────────
  getApplication(): Promise<CompanionApplication | null>;
  saveApplication(a: CompanionApplication): Promise<void>;
}

// ── localStorageDataClient ────────────────────────────────────────────────────
// Thin async wrappers around the existing sync lib functions.
// Zero behaviour change — if it worked before, it works now.

function makeLocalStorageDataClient(): DataClient {
  return {
    // companion catalogue — import deferred inside fn to keep this file
    // free of top-level side-effects that might trip SSR tree-shaking
    async getCompanions() {
      const { COMPANIONS } = await import('./data/companions');
      return COMPANIONS;
    },
    async getCompanion(id) {
      const { getCompanion } = await import('./data/companions');
      return getCompanion(id);
    },

    // wallet
    async getWallet() {
      const { getWallet } = await import('./journeyState');
      return getWallet();
    },
    async addCredits(count) {
      const { addCredits } = await import('./appState');
      const { getWallet } = await import('./journeyState');
      addCredits(count);
      return getWallet();
    },
    async decrementMeeting() {
      const { decrementMeeting } = await import('./journeyState');
      return decrementMeeting();
    },

    // unlock
    async getUnlocked() {
      const { getUnlocked } = await import('./journeyState');
      return getUnlocked();
    },
    async setUnlocked(v) {
      const { setUnlocked } = await import('./journeyState');
      setUnlocked(v);
    },

    // welcomed
    async getWelcomed() {
      const { getWelcomed } = await import('./journeyState');
      return getWelcomed();
    },
    async setWelcomed(v) {
      const { setWelcomed } = await import('./journeyState');
      setWelcomed(v);
    },

    // user
    async getUser() {
      const { getUser } = await import('./journeyState');
      return getUser();
    },
    async setUser(u) {
      const { setUser } = await import('./journeyState');
      setUser(u);
    },

    // bookings
    async getBookings() {
      const { getBookings } = await import('./appState');
      return getBookings();
    },
    async addBooking(b) {
      const { addBooking } = await import('./appState');
      return addBooking(b);
    },
    async updateBooking(id, patch) {
      const { updateBooking } = await import('./appState');
      updateBooking(id, patch);
    },

    // favorites
    async getFavorites() {
      const { getFavorites } = await import('./appState');
      return getFavorites();
    },
    async toggleFavorite(companionId) {
      const { toggleFavorite } = await import('./appState');
      return toggleFavorite(companionId);
    },

    // messages
    async getThread(companionId) {
      const { getThread } = await import('./appState');
      return getThread(companionId);
    },
    async appendMessage(companionId, msg) {
      const { appendMessage } = await import('./appState');
      return appendMessage(companionId, msg);
    },

    // notifications
    async getNotifications() {
      const { getNotifications } = await import('./appState');
      return getNotifications();
    },
    async addNotification(n) {
      const { addNotification } = await import('./appState');
      addNotification(n);
    },

    // plan
    async getPlan() {
      const { getPlan } = await import('./appState');
      return getPlan();
    },
    async setPlan(p) {
      const { setPlan } = await import('./appState');
      setPlan(p);
    },

    // application
    async getApplication() {
      const { getApplication } = await import('./appState');
      return getApplication();
    },
    async saveApplication(a) {
      const { saveApplication } = await import('./appState');
      saveApplication(a);
    },
  };
}

// ── httpDataClient stub ───────────────────────────────────────────────────────
// Replace each TODO stub with a real fetch('/api/...') call when the
// corresponding API route is implemented. Each method mirrors the DataClient
// interface exactly, so no call-site changes needed when you flip the flag.

function makeHttpDataClient(): DataClient {
  async function post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${path}`);
    return res.json() as Promise<T>;
  }

  async function get<T>(path: string): Promise<T> {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${path}`);
    return res.json() as Promise<T>;
  }

  return {
    async getCompanions() {
      return get<Companion[]>('/api/companions');
    },
    async getCompanion(id) {
      return get<Companion | undefined>(`/api/companions/${id}`);
    },

    async getWallet() {
      return get<Wallet>('/api/wallet');
    },
    async addCredits(count) {
      return post<Wallet>('/api/wallet/add-credits', { count });
    },
    async decrementMeeting() {
      return post<Wallet>('/api/wallet/decrement', {});
    },

    async getUnlocked() {
      return get<boolean>('/api/user/unlocked');
    },
    async setUnlocked(v) {
      await post('/api/user/unlocked', { value: v });
    },

    async getWelcomed() {
      return get<boolean>('/api/user/welcomed');
    },
    async setWelcomed(v) {
      await post('/api/user/welcomed', { value: v });
    },

    async getUser() {
      return get<DemoUser | null>('/api/user');
    },
    async setUser(u) {
      await post('/api/user', u);
    },

    async getBookings() {
      return get<Booking[]>('/api/bookings');
    },
    async addBooking(b) {
      return post<Booking>('/api/bookings', b);
    },
    async updateBooking(id, patch) {
      await post(`/api/bookings/${id}`, patch);
    },

    async getFavorites() {
      return get<string[]>('/api/favorites');
    },
    async toggleFavorite(companionId) {
      return post<string[]>('/api/favorites/toggle', { companionId });
    },

    async getThread(companionId) {
      return get<ChatMessage[]>(`/api/messages/${companionId}`);
    },
    async appendMessage(companionId, msg) {
      return post<ChatMessage>(`/api/messages/${companionId}`, msg);
    },

    async getNotifications() {
      return get<AppNotification[]>('/api/notifications');
    },
    async addNotification(n) {
      await post('/api/notifications', n);
    },

    async getPlan() {
      return get<Plan>('/api/subscription');
    },
    async setPlan(p) {
      await post('/api/subscription', { plan: p });
    },

    async getApplication() {
      return get<CompanionApplication | null>('/api/application');
    },
    async saveApplication(a) {
      await post('/api/application', a);
    },
  };
}

// ── Singleton export ──────────────────────────────────────────────────────────
// NEXT_PUBLIC_DATA_CLIENT is read at module-init time (build-time inlined by Next).
// Default: 'local' so the app works with zero config today.
// Flip to 'http' once real API routes are implemented and DATABASE_URL is set.

const clientMode =
  (process.env.NEXT_PUBLIC_DATA_CLIENT as 'local' | 'http' | undefined) ?? 'local';

export const dataClient: DataClient =
  clientMode === 'http' ? makeHttpDataClient() : makeLocalStorageDataClient();
