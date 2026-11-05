/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Team access — contract and local preview.
 *
 * A browser cannot enforce authorisation. Anyone with the device can edit
 * localStorage. This module therefore does two honest things:
 *
 *  1. It models users, roles, and permissions so a server can enforce them
 *     without any component changing.
 *  2. It stores a passphrase hash locally so the panel is not wide open, and
 *     labels the session `local-preview` everywhere it is shown.
 *
 * When a backend exists, replace the bodies of signIn/signOut/getSession with
 * calls to it and delete the local hash. The signatures stay the same.
 */

import { AdminRole, AdminSession, AdminUser, ROLE_PERMISSIONS } from '../types';

const USERS_KEY = 'aura_admin_users_v1';
const SESSION_KEY = 'aura_admin_session_v1';
const CODE_KEY = 'aura_admin_code_v1';

export const SEED_USERS: AdminUser[] = [
  {
    id: 'usr-owner',
    name: 'Owner',
    email: 'owner@aura.local',
    role: 'owner',
    status: 'active',
    createdAt: '2026-11-06',
    lastActiveAt: null
  },
  {
    id: 'usr-manager',
    name: 'Manager',
    email: 'manager@aura.local',
    role: 'manager',
    status: 'invited',
    createdAt: '2026-11-06',
    lastActiveAt: null
  },
  {
    id: 'usr-fulfilment',
    name: 'Fulfilment',
    email: 'fulfilment@aura.local',
    role: 'fulfilment',
    status: 'invited',
    createdAt: '2026-11-06',
    lastActiveAt: null
  }
];

export const ROLE_LABELS: Record<AdminRole, string> = {
  owner: 'Owner',
  manager: 'Manager',
  fulfilment: 'Fulfilment',
  support: 'Support',
  viewer: 'Viewer'
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Could not persist admin state', error);
  }
}

async function hash(value: string): Promise<string | null> {
  if (!globalThis.crypto?.subtle) return null;
  const bytes = new TextEncoder().encode(`aura:${value}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

export const auth = {
  /* ---------------------------- users ---------------------------- */

  getUsers(): AdminUser[] {
    const users = read<AdminUser[]>(USERS_KEY, []);
    if (users.length > 0) return users;
    write(USERS_KEY, SEED_USERS);
    return SEED_USERS;
  },

  saveUsers(users: AdminUser[]): AdminUser[] {
    write(USERS_KEY, users);
    return users;
  },

  addUser(user: Omit<AdminUser, 'id' | 'createdAt' | 'lastActiveAt'>): AdminUser {
    const created: AdminUser = {
      ...user,
      id: `usr-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().slice(0, 10),
      lastActiveAt: null
    };
    auth.saveUsers([...auth.getUsers(), created]);
    return created;
  },

  updateUser(id: string, patch: Partial<AdminUser>): AdminUser[] {
    return auth.saveUsers(auth.getUsers().map(user => (user.id === id ? { ...user, ...patch } : user)));
  },

  removeUser(id: string): AdminUser[] {
    return auth.saveUsers(auth.getUsers().filter(user => user.id !== id));
  },

  /* -------------------------- passphrase -------------------------- */

  hasAccessCode(): boolean {
    return Boolean(localStorage.getItem(CODE_KEY));
  },

  async setAccessCode(code: string): Promise<{ ok: boolean; message: string }> {
    if (code.trim().length < 8) {
      return { ok: false, message: 'Use at least 8 characters. There is no default passphrase.' };
    }
    const digest = await hash(code.trim());
    if (!digest) {
      return { ok: false, message: 'This browser cannot hash securely. Open the site over https or localhost.' };
    }
    localStorage.setItem(CODE_KEY, digest);
    return { ok: true, message: 'Passphrase set on this device.' };
  },

  async verifyAccessCode(code: string): Promise<boolean> {
    const stored = localStorage.getItem(CODE_KEY);
    if (!stored) return false;
    const digest = await hash(code.trim());
    return Boolean(digest) && digest === stored;
  },

  clearAccessCode(): void {
    localStorage.removeItem(CODE_KEY);
    localStorage.removeItem(SESSION_KEY);
  },

  /* --------------------------- session --------------------------- */

  signIn(userId: string): AdminSession | null {
    const user = auth.getUsers().find(candidate => candidate.id === userId);
    if (!user || user.status !== 'active') return null;
    const session: AdminSession = {
      userId: user.id,
      role: user.role,
      startedAt: new Date().toISOString(),
      mode: 'local-preview'
    };
    write(SESSION_KEY, session);
    auth.updateUser(user.id, { lastActiveAt: new Date().toISOString() });
    return session;
  },

  signOut(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  getSession(): AdminSession | null {
    const session = read<AdminSession | null>(SESSION_KEY, null);
    if (!session) return null;
    const user = auth.getUsers().find(candidate => candidate.id === session.userId);
    if (!user || user.status !== 'active') return null;
    return session;
  },

  can(session: AdminSession | null, permission: string): boolean {
    if (!session) return false;
    return ROLE_PERMISSIONS[session.role]?.includes(permission) ?? false;
  },

  currentUser(): AdminUser | null {
    const session = auth.getSession();
    if (!session) return null;
    return auth.getUsers().find(user => user.id === session.userId) ?? null;
  }
};
