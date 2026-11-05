/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Admin gate.
 *
 * This is a local preview lock, not authentication. The passphrase is hashed
 * with SHA-256 and kept in localStorage, which anyone with the device can
 * edit. It exists so the panel is not wide open on a shared machine, and it
 * says so in plain words rather than implying security it cannot provide.
 */

import React, { useState } from 'react';
import { auth, ROLE_LABELS } from '../services/auth';
import { AdminSession, AdminUser } from '../types';

interface AdminGateProps {
  onAuthenticated: (session: AdminSession) => void;
  onBackToShop: () => void;
}

const AdminGate: React.FC<AdminGateProps> = ({ onAuthenticated, onBackToShop }) => {
  const [hasCode] = useState(() => auth.hasAccessCode());
  const [code, setCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [users] = useState<AdminUser[]>(() => auth.getUsers());
  const [selectedUser, setSelectedUser] = useState<string>(
    () => auth.getUsers().find(user => user.status === 'active')?.id ?? ''
  );

  const enter = (userId: string) => {
    const session = auth.signIn(userId);
    if (!session) {
      setError('That team member is not active. Ask the owner to reactivate the account.');
      return;
    }
    onAuthenticated(session);
  };

  const handleCreateCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (code.trim().length < 8) {
      setError('Use at least 8 characters. There is no default passphrase, on purpose.');
      return;
    }
    if (code !== confirmCode) {
      setError('The two entries do not match.');
      return;
    }

    setIsBusy(true);
    const result = await auth.setAccessCode(code);
    setIsBusy(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    if (selectedUser) enter(selectedUser);
  };

  const handleUnlock = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsBusy(true);
    const ok = await auth.verifyAccessCode(code);
    setIsBusy(false);

    if (!ok) {
      setError('That passphrase does not match the one set on this device.');
      return;
    }
    if (selectedUser) enter(selectedUser);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#F5F2EB] flex flex-col items-center justify-center animate-fade-in-up">
      <div className="w-full max-w-md bg-[#EBE7DE]/60 border border-[#D6D1C7] p-10 shadow-lg">
        <div className="w-12 h-12 bg-[#2C2A26] text-[#F5F2EB] flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>

        <span className="text-xs uppercase tracking-widest text-[#A8A29E] block mb-2">Team access · local preview</span>
        <h1 className="text-3xl font-serif text-[#2C2A26] mb-3">
          {hasCode ? 'Unlock the panel' : 'Set a passphrase'}
        </h1>
        <p className="text-sm text-[#5D5A53] mb-6 font-light leading-relaxed">
          {hasCode
            ? 'Enter the passphrase set on this device, then choose who you are.'
            : 'No default password exists. Choose a passphrase now; it is stored only in this browser.'}
        </p>

        <div className="border border-[#D6D1C7] bg-white/60 p-3 mb-6 text-[11px] text-[#5D5A53] leading-relaxed">
          This lock is <strong className="text-[#2C2A26] font-medium">not real authentication</strong>. It keeps a shared
          laptop tidy. Real roles and permissions need a server, and that is not connected yet.
        </div>

        {error && (
          <p className="text-xs text-[#7A4038] bg-rose-50 border border-rose-200 p-3 mb-4">{error}</p>
        )}

        <form onSubmit={hasCode ? handleUnlock : handleCreateCode} className="space-y-4">
          <div>
            <label htmlFor="admin-code" className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">
              {hasCode ? 'Passphrase' : 'New passphrase'}
            </label>
            <input
              id="admin-code"
              type="password"
              autoFocus
              autoComplete={hasCode ? 'current-password' : 'new-password'}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="At least 8 characters"
              className="w-full bg-white border border-[#D6D1C7] p-3 text-sm text-[#2C2A26] outline-none focus:border-[#2C2A26] transition-colors"
            />
          </div>

          {!hasCode && (
            <div>
              <label htmlFor="admin-code-confirm" className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">Repeat passphrase</label>
              <input
                id="admin-code-confirm"
                type="password"
                autoComplete="new-password"
                value={confirmCode}
                onChange={(event) => setConfirmCode(event.target.value)}
                className="w-full bg-white border border-[#D6D1C7] p-3 text-sm text-[#2C2A26] outline-none focus:border-[#2C2A26] transition-colors"
              />
            </div>
          )}

          <div>
            <label htmlFor="admin-user" className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">Sign in as</label>
            <select
              id="admin-user"
              value={selectedUser}
              onChange={(event) => setSelectedUser(event.target.value)}
              className="w-full bg-white border border-[#D6D1C7] p-3 text-sm text-[#2C2A26] outline-none focus:border-[#2C2A26]"
            >
              {users.map(user => (
                <option key={user.id} value={user.id} disabled={user.status !== 'active'}>
                  {user.name} — {ROLE_LABELS[user.role]}{user.status !== 'active' ? ` (${user.status})` : ''}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-[#A8A29E] mt-1 block">
              Only active members can sign in. Roles are recorded but cannot be enforced in the browser.
            </span>
          </div>

          <button
            type="submit"
            disabled={isBusy || !selectedUser}
            className="w-full py-4 bg-[#2C2A26] text-[#F5F2EB] text-xs uppercase tracking-widest font-medium hover:bg-[#433E38] transition-colors disabled:opacity-50"
          >
            {isBusy ? 'Checking…' : hasCode ? 'Unlock panel' : 'Set passphrase and continue'}
          </button>
        </form>

        <button
          onClick={onBackToShop}
          className="mt-8 text-xs uppercase tracking-widest text-[#A8A29E] hover:text-[#2C2A26] transition-colors inline-block"
        >
          ← Return to storefront
        </button>
      </div>
    </div>
  );
};

export default AdminGate;
