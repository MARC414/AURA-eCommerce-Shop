/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Admin panel.
 *
 * Rewritten because the previous version was three problems in one file:
 * it used a default PIN of `admin123`, it showed invented revenue as if
 * money had arrived, and it called itself a "Dropshipping Headquarters",
 * which leaks the supply chain to anyone who opens the page.
 *
 * What it is now: a local-preview operations panel with honest numbers, a
 * team section that models roles for a future server, and a read-only view
 * of the compliance register so nobody has to open JSON to see what is
 * missing before a product can be sold.
 */

import React, { useMemo, useState } from 'react';
import { AdminRole, AdminSession, AdminUser, ComplianceRegister, Order, Product, StoreSettings } from '../types';
import { storeService } from '../services/storeService';
import { auth, ROLE_LABELS } from '../services/auth';
import { commerce } from '../services/commerce';
import { getProvider } from '../services/payments';
import { ROLE_PERMISSIONS } from '../types';
import complianceRegister from '../data/compliance.json';
import AdminGate from './AdminGate';

interface AdminDashboardProps {
  onBackToShop: () => void;
}

type Tab = 'overview' | 'requests' | 'catalogue' | 'team' | 'compliance' | 'settings';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'requests', label: 'Order requests' },
  { id: 'catalogue', label: 'Catalogue' },
  { id: 'team', label: 'Team' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'settings', label: 'Settings' }
];

const STATUS_STYLE: Record<string, string> = {
  verified: 'bg-[#E7EFE6] border-[#B9CBB5] text-[#33502F]',
  pending: 'bg-[#F6EFDD] border-[#DDCEAC] text-[#6D5A2F]',
  'not-provided': 'bg-[#F4E7E4] border-[#DFC3BD] text-[#7A4038]',
  'not-applicable': 'bg-[#EBE7DE] border-[#D6D1C7] text-[#5D5A53]'
};

const PAYMENT_STYLE: Record<string, string> = {
  awaiting_payment: 'bg-[#F6EFDD] border-[#DDCEAC] text-[#6D5A2F]',
  paid: 'bg-[#E7EFE6] border-[#B9CBB5] text-[#33502F]',
  refunded: 'bg-[#EBE7DE] border-[#D6D1C7] text-[#5D5A53]',
  cancelled: 'bg-[#F4E7E4] border-[#DFC3BD] text-[#7A4038]'
};

const Pill: React.FC<{ children: React.ReactNode; className: string }> = ({ children, className }) => (
  <span className={`inline-flex px-2 py-0.5 text-[10px] uppercase tracking-wider border whitespace-nowrap ${className}`}>
    {children}
  </span>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToShop }) => {
  const [session, setSession] = useState<AdminSession | null>(() => auth.getSession());
  const [tab, setTab] = useState<Tab>('overview');
  const [settings, setSettings] = useState<StoreSettings>(() => storeService.getSettings());
  const [orders, setOrders] = useState<Order[]>(() => storeService.getOrders());
  const [products] = useState<Product[]>(() => storeService.getProducts());
  const [users, setUsers] = useState<AdminUser[]>(() => auth.getUsers());
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingDraft, setTrackingDraft] = useState('');
  const [carrierDraft, setCarrierDraft] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'viewer' as AdminRole });
  const [teamMessage, setTeamMessage] = useState<string | null>(null);

  const register = complianceRegister as unknown as ComplianceRegister;
  const symbol = settings.currency || '£';

  const stats = useMemo(() => {
    const awaiting = orders.filter(order => order.paymentStatus === 'awaiting_payment');
    const paid = orders.filter(order => order.paymentStatus === 'paid');
    const revenue = paid.reduce((sum, order) => sum + order.total, 0);
    const unknownCosts = orders.filter(order => order.supplierCostTotal === 0).length;
    return { awaiting, paid, revenue, unknownCosts };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter(order =>
      order.id.toLowerCase().includes(term) ||
      order.customer.fullName.toLowerCase().includes(term) ||
      order.customer.email.toLowerCase().includes(term)
    );
  }, [orders, search]);

  if (!session) {
    return <AdminGate onAuthenticated={setSession} onBackToShop={onBackToShop} />;
  }

  const canWriteCatalogue = auth.can(session, 'catalogue:write');
  const canWriteTeam = auth.can(session, 'team:write');
  const canWriteOrders = auth.can(session, 'orders:write');
  const currentUser = users.find(user => user.id === session.userId) || null;

  const refreshOrders = () => setOrders(storeService.getOrders());

  const handleFulfilment = (order: Order, status: Order['fulfillmentStatus']) => {
    storeService.updateOrderStatus(order.id, status, trackingDraft || undefined, carrierDraft || undefined);
    refreshOrders();
    setSelectedOrder(null);
    setTrackingDraft('');
    setCarrierDraft('');
  };

  const handleSaveSettings = (event: React.FormEvent) => {
    event.preventDefault();
    storeService.updateSettings(settings);
    setSettingsSaved(true);
    window.setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleAddUser = (event: React.FormEvent) => {
    event.preventDefault();
    const name = newUser.name.trim();
    const email = newUser.email.trim().toLowerCase();

    if (!name || !email.includes('@')) {
      setTeamMessage('A name and a valid email address are both required.');
      return;
    }
    if (users.some(user => user.email.toLowerCase() === email)) {
      setTeamMessage('That email is already on the team list.');
      return;
    }

    setUsers(auth.addUser({ name, email, role: newUser.role, status: 'invited' }));
    setNewUser({ name: '', email: '', role: 'viewer' });
    setTeamMessage('Added as invited. An invitation email cannot be sent until a backend exists.');
  };

  const handleRoleChange = (id: string, role: AdminRole) => {
    setUsers(auth.updateUser(id, { role }));
  };

  const handleStatusChange = (id: string, status: AdminUser['status']) => {
    if (id === session.userId) {
      setTeamMessage('You cannot suspend your own account while signed in.');
      return;
    }
    setUsers(auth.updateUser(id, { status }));
  };

  const handleRemoveUser = (id: string) => {
    if (id === session.userId) {
      setTeamMessage('You cannot remove the account you are signed in as.');
      return;
    }
    if (!window.confirm('Remove this team member from the local list?')) return;
    setUsers(auth.removeUser(id));
  };

  const handleSignOut = () => {
    auth.signOut();
    setSession(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 md:px-12 bg-[#F5F2EB] animate-fade-in">
      <div className="max-w-[1700px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 border-b border-[#D6D1C7] mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-[#8C7355] font-medium">Operations</span>
              <Pill className="bg-[#F6EFDD] border-[#DDCEAC] text-[#6D5A2F]">Local preview</Pill>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#2C2A26] mt-1">AURA workspace</h1>
            <p className="text-xs text-[#5D5A53] mt-2">
              Signed in as {currentUser?.name || 'team member'} · {ROLE_LABELS[session.role]} · data stored in this browser only
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => storeService.exportOrdersCSV()}
              className="px-4 py-2.5 bg-white border border-[#D6D1C7] text-[#2C2A26] text-xs uppercase tracking-widest font-medium hover:bg-[#EBE7DE] transition-colors"
            >
              Export orders CSV
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2.5 bg-white border border-[#D6D1C7] text-[#5D5A53] text-xs uppercase tracking-widest font-medium hover:bg-[#EBE7DE] transition-colors"
            >
              Sign out
            </button>
            <button
              onClick={onBackToShop}
              className="px-4 py-2.5 bg-[#2C2A26] text-[#F5F2EB] text-xs uppercase tracking-widest font-medium hover:bg-[#433E38] transition-colors"
            >
              View storefront
            </button>
          </div>
        </div>

        <div className="border border-[#D6D1C7] bg-white/60 p-4 mb-8 text-xs text-[#5D5A53] leading-relaxed">
          <strong className="text-[#2C2A26] font-medium">Read this before trusting any number here.</strong> There is no
          server, no database, and no payment provider. Orders, team members, and newsletter sign-ups live in this
          browser. Clearing site data erases them. Nothing here is a real sale, and no payment status can be set to
          &ldquo;paid&rdquo; from this screen.
        </div>

        <div className="flex border-b border-[#D6D1C7] gap-6 mb-10 overflow-x-auto">
          {TABS.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`pb-4 text-xs uppercase tracking-widest font-medium border-b-2 transition-all whitespace-nowrap ${
                tab === item.id
                  ? 'border-[#2C2A26] text-[#2C2A26]'
                  : 'border-transparent text-[#A8A29E] hover:text-[#2C2A26]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-7 bg-[#EBE7DE]/50 border border-[#D6D1C7]">
                <span className="text-xs uppercase tracking-widest text-[#A8A29E] block mb-2">Order requests</span>
                <span className="text-3xl font-serif text-[#2C2A26] tabular-nums block">{orders.length}</span>
                <span className="text-xs text-[#5D5A53] mt-2 block">Recorded on this device</span>
              </div>
              <div className="p-7 bg-[#EBE7DE]/50 border border-[#D6D1C7]">
                <span className="text-xs uppercase tracking-widest text-[#A8A29E] block mb-2">Awaiting payment</span>
                <span className="text-3xl font-serif text-[#6D5A2F] tabular-nums block">{stats.awaiting.length}</span>
                <span className="text-xs text-[#5D5A53] mt-2 block">Invoice not yet settled</span>
              </div>
              <div className="p-7 bg-[#EBE7DE]/50 border border-[#D6D1C7]">
                <span className="text-xs uppercase tracking-widest text-[#A8A29E] block mb-2">Settled revenue</span>
                <span className="text-3xl font-serif text-[#2C2A26] tabular-nums block">{symbol}{stats.revenue.toFixed(2)}</span>
                <span className="text-xs text-[#5D5A53] mt-2 block">Only orders marked paid by a server</span>
              </div>
              <div className="p-7 bg-[#EBE7DE]/50 border border-[#D6D1C7]">
                <span className="text-xs uppercase tracking-widest text-[#A8A29E] block mb-2">Catalogue items</span>
                <span className="text-3xl font-serif text-[#2C2A26] tabular-nums block">{products.length}</span>
                <span className="text-xs text-[#5D5A53] mt-2 block">Preview only, not open for orders</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-7 bg-white/70 border border-[#D6D1C7]">
                <h3 className="font-serif text-[#2C2A26] text-xl mb-3">What still blocks a real sale</h3>
                <ul className="text-sm text-[#5D5A53] space-y-2 leading-relaxed">
                  <li>· A payment provider that will settle to Bangladesh, or a partner entity that can receive funds.</li>
                  <li>· A trading entity, address, and contact details on every invoice.</li>
                  <li>· Verified product evidence for every item: ingredient list, safety report, responsible person.</li>
                  <li>· A written supplier agreement, including resale permission and order limits.</li>
                </ul>
              </div>
              <div className="p-7 bg-white/70 border border-[#D6D1C7]">
                <h3 className="font-serif text-[#2C2A26] text-xl mb-3">Data quality warnings</h3>
                <ul className="text-sm text-[#5D5A53] space-y-2 leading-relaxed">
                  <li>· {stats.unknownCosts} order request(s) have no recorded supplier cost, so margin is not meaningful.</li>
                  <li>· Newsletter addresses are queued locally; no mailing provider is connected.</li>
                  <li>· Team roles are stored but cannot be enforced without a server.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === 'requests' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by order number, name, or email"
                className="w-full sm:max-w-sm bg-white border border-[#D6D1C7] p-3 text-sm outline-none focus:border-[#2C2A26]"
              />
              <span className="text-xs text-[#A8A29E]">{filteredOrders.length} of {orders.length} shown</span>
            </div>

            {orders.length === 0 ? (
              <div className="border border-[#D6D1C7] bg-white/60 p-12 text-center">
                <p className="font-serif text-xl text-[#2C2A26] mb-2">No order requests yet</p>
                <p className="text-sm text-[#5D5A53]">
                  Requests placed through checkout appear here as <em>awaiting payment</em>. None have been made on this device.
                </p>
              </div>
            ) : (
              <div className="border border-[#D6D1C7] overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#EBE7DE]/60 text-left">
                    <tr className="text-[10px] uppercase tracking-widest text-[#5D5A53]">
                      <th className="p-4 font-medium">Reference</th>
                      <th className="p-4 font-medium">Date</th>
                      <th className="p-4 font-medium">Customer</th>
                      <th className="p-4 font-medium">Items total</th>
                      <th className="p-4 font-medium">Payment</th>
                      <th className="p-4 font-medium">Fulfilment</th>
                      <th className="p-4 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D6D1C7]">
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="bg-white/40 hover:bg-white/80 transition-colors">
                        <td className="p-4 font-mono text-xs text-[#2C2A26]">{order.id}</td>
                        <td className="p-4 text-xs text-[#5D5A53]">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="p-4 text-xs text-[#2C2A26]">
                          {order.customer.fullName}
                          <span className="block text-[#A8A29E]">{order.customer.email}</span>
                        </td>
                        <td className="p-4 text-xs tabular-nums text-[#2C2A26]">{symbol}{order.total.toFixed(2)}</td>
                        <td className="p-4">
                          <Pill className={PAYMENT_STYLE[order.paymentStatus] || PAYMENT_STYLE.cancelled}>
                            {order.paymentStatus.replace('_', ' ')}
                          </Pill>
                        </td>
                        <td className="p-4 text-xs text-[#5D5A53]">{order.fulfillmentStatus}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setTrackingDraft(order.trackingNumber || '');
                              setCarrierDraft(order.carrier || '');
                            }}
                            className="text-xs uppercase tracking-widest text-[#8C7355] hover:underline"
                          >
                            Open
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedOrder && (
              <div className="mt-8 border border-[#D6D1C7] bg-white p-6 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#A8A29E] block">Request {selectedOrder.id}</span>
                    <h3 className="font-serif text-2xl text-[#2C2A26]">{selectedOrder.customer.fullName}</h3>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="text-xs uppercase tracking-widest text-[#A8A29E] hover:text-[#2C2A26]">
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-[#5D5A53] mb-3">Items</h4>
                    <ul className="divide-y divide-[#D6D1C7] text-sm">
                      {selectedOrder.items.map((item, index) => (
                        <li key={`${item.productId}-${index}`} className="py-2 flex justify-between gap-4">
                          <span className="text-[#2C2A26]">{item.name} × {item.quantity}</span>
                          <span className="tabular-nums text-[#5D5A53]">{symbol}{(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-[#A8A29E] mt-3">
                      Shipping is quoted on the invoice and is not included here.
                    </p>
                    {selectedOrder.customerNote && (
                      <p className="text-xs text-[#8C7355] italic mt-3">&ldquo;{selectedOrder.customerNote}&rdquo;</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-[#5D5A53] mb-3">Delivery & payment</h4>
                    <p className="text-xs text-[#5D5A53] leading-relaxed">
                      {selectedOrder.customer.address}
                      {selectedOrder.customer.apartment ? `, ${selectedOrder.customer.apartment}` : ''}<br />
                      {selectedOrder.customer.city} {selectedOrder.customer.postalCode}<br />
                      {selectedOrder.customer.country}
                    </p>
                    <p className="text-xs text-[#5D5A53] mt-3">
                      Requested route: {getProvider(selectedOrder.paymentMethod)?.name || selectedOrder.paymentMethod}
                    </p>
                    <p className="text-xs text-[#7A4038] mt-2">
                      Payment status is set by a server webhook only. This panel cannot mark an order paid.
                    </p>
                  </div>
                </div>

                {canWriteOrders ? (
                  <div className="mt-8 pt-6 border-t border-[#D6D1C7]">
                    <h4 className="text-xs uppercase tracking-widest text-[#5D5A53] mb-3">Record fulfilment</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <input
                        value={carrierDraft}
                        onChange={(event) => setCarrierDraft(event.target.value)}
                        placeholder="Carrier (only if a real one is booked)"
                        className="bg-white border border-[#D6D1C7] p-3 text-sm outline-none focus:border-[#2C2A26]"
                      />
                      <input
                        value={trackingDraft}
                        onChange={(event) => setTrackingDraft(event.target.value)}
                        placeholder="Tracking number (only if real)"
                        className="bg-white border border-[#D6D1C7] p-3 text-sm outline-none focus:border-[#2C2A26]"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(['unfulfilled', 'processing', 'shipped', 'delivered'] as const).map(status => (
                        <button
                          key={status}
                          onClick={() => handleFulfilment(selectedOrder, status)}
                          className="px-4 py-2 border border-[#D6D1C7] text-xs uppercase tracking-widest text-[#2C2A26] hover:bg-[#EBE7DE] transition-colors"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-[#A8A29E] mt-3">
                      Leave the carrier and tracking fields empty unless a shipment genuinely exists. Never invent either.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-[#7A4038] mt-6">Your role cannot change fulfilment status.</p>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'catalogue' && (
          <div>
            <div className="border border-[#D6D1C7] bg-white/60 p-4 mb-6 text-xs text-[#5D5A53] leading-relaxed">
              The catalogue is defined in <code className="font-mono text-[#2C2A26]">data/pilot-products.json</code> and the
              compliance register in <code className="font-mono text-[#2C2A26]">data/compliance.json</code>, so every change
              is reviewable and versioned. Editing products inside the browser would create a second, unversioned source of
              truth.
              {!canWriteCatalogue && ' Your role has read-only access.'}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="border border-[#D6D1C7] bg-white/50 p-5">
                  <div className="flex gap-4">
                    <img src={product.imageUrl} alt={product.name} className="w-16 h-20 object-cover bg-[#EBE7DE]" />
                    <div className="flex-1">
                      <h3 className="font-serif text-[#2C2A26] text-lg leading-tight">{product.name}</h3>
                      <p className="text-[11px] uppercase tracking-widest text-[#A8A29E] mt-1">{product.category}</p>
                      <p className="text-sm text-[#2C2A26] mt-2 tabular-nums">{symbol}{product.price.toFixed(2)}</p>
                      <p className="text-[11px] text-[#5D5A53]">Supplier cost: {product.supplierCost ? `${symbol}${product.supplierCost.toFixed(2)}` : 'not recorded'}</p>
                      <p className="text-[11px] text-[#5D5A53]">Stock: {product.stock}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'team' && (
          <div className="space-y-8">
            <div className="border border-[#D6D1C7] bg-white/60 p-4 text-xs text-[#5D5A53] leading-relaxed">
              Roles below describe what a server <em>will</em> enforce. In this preview any visitor with the passphrase can
              change anything, because a browser cannot enforce authorisation. Treat these as a design, not a control.
            </div>

            {teamMessage && (
              <p className="text-xs bg-[#F6EFDD] border border-[#DDCEAC] text-[#6D5A2F] p-3">{teamMessage}</p>
            )}

            <div className="border border-[#D6D1C7] overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#EBE7DE]/60 text-left">
                  <tr className="text-[10px] uppercase tracking-widest text-[#5D5A53]">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium">Role</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Last active</th>
                    <th className="p-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D6D1C7]">
                  {users.map(user => (
                    <tr key={user.id} className="bg-white/40">
                      <td className="p-4 text-[#2C2A26]">
                        {user.name}
                        {user.id === session.userId && <span className="text-[10px] uppercase tracking-widest text-[#8C7355] ml-2">you</span>}
                      </td>
                      <td className="p-4 text-xs text-[#5D5A53]">{user.email}</td>
                      <td className="p-4">
                        <select
                          value={user.role}
                          disabled={!canWriteTeam}
                          onChange={(event) => handleRoleChange(user.id, event.target.value as AdminRole)}
                          className="bg-white border border-[#D6D1C7] p-2 text-xs disabled:opacity-60"
                        >
                          {(Object.keys(ROLE_LABELS) as AdminRole[]).map(role => (
                            <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <select
                          value={user.status}
                          disabled={!canWriteTeam}
                          onChange={(event) => handleStatusChange(user.id, event.target.value as AdminUser['status'])}
                          className="bg-white border border-[#D6D1C7] p-2 text-xs disabled:opacity-60"
                        >
                          <option value="active">active</option>
                          <option value="invited">invited</option>
                          <option value="suspended">suspended</option>
                        </select>
                      </td>
                      <td className="p-4 text-xs text-[#A8A29E]">
                        {user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleString() : 'never'}
                      </td>
                      <td className="p-4 text-right">
                        {canWriteTeam && (
                          <button
                            onClick={() => handleRemoveUser(user.id)}
                            className="text-xs uppercase tracking-widest text-[#7A4038] hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {canWriteTeam && (
              <form onSubmit={handleAddUser} className="border border-[#D6D1C7] bg-white/50 p-6">
                <h3 className="font-serif text-xl text-[#2C2A26] mb-4">Add a team member</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    value={newUser.name}
                    onChange={(event) => setNewUser({ ...newUser, name: event.target.value })}
                    placeholder="Full name"
                    className="bg-white border border-[#D6D1C7] p-3 text-sm outline-none focus:border-[#2C2A26]"
                  />
                  <input
                    value={newUser.email}
                    onChange={(event) => setNewUser({ ...newUser, email: event.target.value })}
                    placeholder="Email address"
                    className="bg-white border border-[#D6D1C7] p-3 text-sm outline-none focus:border-[#2C2A26]"
                  />
                  <select
                    value={newUser.role}
                    onChange={(event) => setNewUser({ ...newUser, role: event.target.value as AdminRole })}
                    className="bg-white border border-[#D6D1C7] p-3 text-sm"
                  >
                    {(Object.keys(ROLE_LABELS) as AdminRole[]).map(role => (
                      <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="mt-4 px-6 py-3 bg-[#2C2A26] text-[#F5F2EB] text-xs uppercase tracking-widest font-medium hover:bg-[#433E38] transition-colors"
                >
                  Add member
                </button>
              </form>
            )}

            <div className="border border-[#D6D1C7] bg-white/50 p-6 overflow-x-auto">
              <h3 className="font-serif text-xl text-[#2C2A26] mb-4">Permission matrix</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-widest text-[#5D5A53]">
                    <th className="p-2 font-medium">Role</th>
                    <th className="p-2 font-medium">Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D6D1C7]">
                  {(Object.keys(ROLE_PERMISSIONS) as AdminRole[]).map(role => (
                    <tr key={role}>
                      <td className="p-2 text-[#2C2A26] whitespace-nowrap">{ROLE_LABELS[role]}</td>
                      <td className="p-2 text-[#5D5A53]">{ROLE_PERMISSIONS[role].join(' · ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'compliance' && (
          <div className="space-y-8">
            <div className="border border-[#D6D1C7] bg-white/60 p-4 text-xs text-[#5D5A53] leading-relaxed">
              Last reviewed {register.lastReviewed}. A claim may only be published when its record is{' '}
              <strong className="text-[#33502F]">verified</strong>. Records are never upgraded automatically, and missing
              evidence is recorded as missing. Nothing here can be edited from the browser.
            </div>

            {register.records.map(record => {
              const counts = record.items.reduce<Record<string, number>>((totals, item) => {
                totals[item.status] = (totals[item.status] || 0) + 1;
                return totals;
              }, {});
              return (
                <div key={record.id} className="border border-[#D6D1C7] bg-white/50">
                  <div className="p-6 border-b border-[#D6D1C7]">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-serif text-xl text-[#2C2A26]">{record.productName}</h3>
                      <Pill className="bg-[#EBE7DE] border-[#D6D1C7] text-[#5D5A53]">{record.riskTier}</Pill>
                      <span className="text-[11px] text-[#A8A29E]">
                        {counts.verified || 0} verified · {(counts.pending || 0) + (counts['not-provided'] || 0)} outstanding
                      </span>
                    </div>
                    <p className="text-xs text-[#5D5A53] leading-relaxed">{record.riskReason}</p>
                    {record.responsiblePerson && (
                      <p className="text-[11px] text-[#8C7355] mt-2">
                        Responsible person: {record.responsiblePerson.name} · {record.responsiblePerson.country} ·{' '}
                        {record.responsiblePerson.status}
                      </p>
                    )}
                  </div>

                  <ul className="divide-y divide-[#D6D1C7]">
                    {record.items.map(item => (
                      <li key={item.id} className="p-4 grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-3 items-start">
                        <Pill className={STATUS_STYLE[item.status]}>{item.status.replace('-', ' ')}</Pill>
                        <div>
                          <p className="text-sm text-[#2C2A26]">{item.label}</p>
                          <p className="text-xs text-[#5D5A53] leading-relaxed mt-0.5">{item.note}</p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="p-4 bg-[#EBE7DE]/40 border-t border-[#D6D1C7]">
                    <p className="text-[10px] uppercase tracking-widest text-[#5D5A53] mb-2">Claims not made</p>
                    <p className="text-xs text-[#5D5A53] leading-relaxed">{record.blockedClaims.join(' · ')}</p>
                  </div>
                </div>
              );
            })}

            <div className="border border-[#D6D1C7] bg-white/50 p-6">
              <h3 className="font-serif text-xl text-[#2C2A26] mb-4">Store-level requirements</h3>
              <ul className="divide-y divide-[#D6D1C7]">
                {register.storeLevel.map(item => (
                  <li key={item.id} className="py-3 grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-3 items-start">
                    <Pill className={STATUS_STYLE[item.status]}>{item.status.replace('-', ' ')}</Pill>
                    <div>
                      <p className="text-sm text-[#2C2A26]">{item.label}</p>
                      <p className="text-xs text-[#5D5A53] leading-relaxed mt-0.5">{item.note}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-[#D6D1C7] bg-white/50 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="font-serif text-xl text-[#2C2A26]">Newsletter sign-ups</h3>
                <button
                  onClick={() => commerce.exportSubscribersCSV()}
                  className="px-4 py-2 border border-[#D6D1C7] text-xs uppercase tracking-widest text-[#2C2A26] hover:bg-[#EBE7DE] transition-colors"
                >
                  Export CSV
                </button>
              </div>
              <p className="text-xs text-[#5D5A53] mb-4">
                Stored in this browser with the time consent was given. No mailing provider is connected, so nothing has
                been sent.
              </p>
              {commerce.getSubscribers().length === 0 ? (
                <p className="text-xs text-[#A8A29E]">No addresses captured on this device.</p>
              ) : (
                <ul className="divide-y divide-[#D6D1C7] text-xs">
                  {commerce.getSubscribers().map(subscriber => (
                    <li key={subscriber.email} className="py-2 flex flex-wrap justify-between gap-2">
                      <span className="text-[#2C2A26]">{subscriber.email}</span>
                      <span className="text-[#A8A29E]">
                        {new Date(subscriber.consentAt).toLocaleDateString()} · {subscriber.status} · {subscriber.delivery}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="max-w-2xl space-y-6">
            <div className="border border-[#D6D1C7] bg-white/60 p-4 text-xs text-[#5D5A53] leading-relaxed">
              These values change the storefront in this browser. The admin passphrase is no longer stored here: it is
              separate, hashed, and cannot be read back.
            </div>

            <div>
              <label htmlFor="settings-name" className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">Store name</label>
              <input
                id="settings-name"
                value={settings.storeName}
                onChange={(event) => setSettings({ ...settings, storeName: event.target.value })}
                className="w-full bg-white border border-[#D6D1C7] p-3 text-sm outline-none focus:border-[#2C2A26]"
              />
            </div>

            <div>
              <label htmlFor="settings-email" className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">Support email</label>
              <input
                id="settings-email"
                type="email"
                value={settings.supportEmail}
                onChange={(event) => setSettings({ ...settings, supportEmail: event.target.value })}
                className="w-full bg-white border border-[#D6D1C7] p-3 text-sm outline-none focus:border-[#2C2A26]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="settings-currency" className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">Currency symbol</label>
                <input
                  id="settings-currency"
                  value={settings.currency}
                  onChange={(event) => setSettings({ ...settings, currency: event.target.value })}
                  className="w-full bg-white border border-[#D6D1C7] p-3 text-sm outline-none focus:border-[#2C2A26]"
                />
              </div>
              <div>
                <label htmlFor="settings-threshold" className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">Free shipping over</label>
                <input
                  id="settings-threshold"
                  type="number"
                  min={0}
                  value={settings.freeShippingThreshold}
                  onChange={(event) => setSettings({ ...settings, freeShippingThreshold: Number(event.target.value) })}
                  className="w-full bg-white border border-[#D6D1C7] p-3 text-sm outline-none focus:border-[#2C2A26]"
                />
              </div>
              <div>
                <label htmlFor="settings-fee" className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">Standard shipping</label>
                <input
                  id="settings-fee"
                  type="number"
                  min={0}
                  value={settings.standardShippingFee}
                  onChange={(event) => setSettings({ ...settings, standardShippingFee: Number(event.target.value) })}
                  className="w-full bg-white border border-[#D6D1C7] p-3 text-sm outline-none focus:border-[#2C2A26]"
                />
              </div>
            </div>

            <p className="text-[11px] text-[#A8A29E] leading-relaxed">
              Shipping values are stored for later use. Checkout does not apply them yet, because no shipping rate has been
              agreed with a carrier. That is deliberate.
            </p>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-[#2C2A26] text-[#F5F2EB] text-xs uppercase tracking-widest font-medium hover:bg-[#433E38] transition-colors"
              >
                Save settings
              </button>
              {settingsSaved && <span className="text-xs text-[#33502F]">Saved on this device.</span>}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
