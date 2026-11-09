/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The admin entry. `npm run dev:admin` opens this page; nothing else loads it.
 *
 * It replaces `index.tsx`, which mounted the whole storefront shell so that one
 * view of it could be a dashboard. The storefront is generated HTML now, so the
 * only thing left for React in this repository is the panel: AdminDashboard
 * gates itself with AdminGate, reads this browser's storage, and never ships.
 *
 * "Back to the shop" leaves the panel and opens the generated homepage. It
 * points at `/index.html` rather than `/` because this dev server serves
 * `public/` as its asset directory: the file itself is always reachable, while
 * `/` is a directory route Vite does not resolve. On a static host both work.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import AdminDashboard from './components/AdminDashboard';
import './index.css';

const rootElement = document.getElementById('admin-root');
if (!rootElement) throw new Error('Could not find #admin-root to mount the admin panel');

createRoot(rootElement).render(
  <React.StrictMode>
    <AdminDashboard onBackToShop={() => window.location.assign('/index.html')} />
  </React.StrictMode>
);
