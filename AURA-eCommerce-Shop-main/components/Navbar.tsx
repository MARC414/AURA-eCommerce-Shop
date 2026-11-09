/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Navigation.
 *
 * D-033: this component reads `data/site.json` — the same contract the static
 * page generator renders — so the React shell and the generated pages share one
 * navigation architecture: four top-level sections (Shop, Perennis, Journal,
 * About), each with the same children, labels and groups. Nothing is hard-coded
 * here, so a menu change is a data change in one file.
 *
 * Shop carries both the browse links (all pieces, partner offers) and the six
 * category rooms; there is no separate "Categories" or "Discover" top-level
 * item. Cart and wishlist stay as overlays driven by the props below, and the
 * two internal controls (lineage/sources, team access) are utility icons rather
 * than customer navigation.
 *
 * Colours come from the approved palette only (canvas/surface/line/body/paper/
 * cta); no new hue, gradient or decorative element is introduced.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import siteData from '../data/site.json';

interface NavChild {
  label: string;
  href: string;
  note?: string;
  group?: string;
  published?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  published?: boolean;
  children?: NavChild[];
}

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  onOpenSources?: () => void;
}

/** The published navigation, exactly as the static header renders it. */
const NAV_ITEMS = (siteData.nav as NavItem[]).filter(item => item.published !== false);
const BRAND = siteData.brand;

const isPublished = (item: { published?: boolean }) => item.published !== false;

/** Children grouped by their optional `group` label, preserving order. */
function groupChildren(children: NavChild[]): Array<[string, NavChild[]]> {
  const groups = new Map<string, NavChild[]>();
  children.filter(isPublished).forEach(child => {
    const key = child.group || '';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(child);
  });
  return [...groups.entries()];
}

const chevron = (className: string) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

interface DesktopMenuProps {
  item: NavItem;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  hoverCapable: React.RefObject<boolean>;
}

/**
 * One top-level section in the desktop bar. The trigger is a button that owns
 * the panel: aria-expanded/aria-controls, ArrowDown to enter, Escape to leave
 * and return focus, pointer hover only on hover-capable devices so a tap on a
 * tablet does not fight the click.
 */
const DesktopMenu: React.FC<DesktopMenuProps> = ({ item, open, onOpen, onClose, onToggle, hoverCapable }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [focusFirst, setFocusFirst] = useState(false);

  const children = (item.children || []).filter(isPublished);
  const groups = groupChildren(children);

  useEffect(() => {
    if (open && focusFirst) {
      panelRef.current?.querySelector<HTMLElement>('a')?.focus();
      setFocusFirst(false);
    }
  }, [open, focusFirst]);

  const focusFirstLink = useCallback(() => {
    const first = panelRef.current?.querySelector<HTMLElement>('a');
    if (first) first.focus();
    else setFocusFirst(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) onClose();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={`nav-panel-${item.id}`}
        onClick={onToggle}
        onKeyDown={event => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (!open) onOpen();
            focusFirstLink();
          } else if (event.key === 'Escape') {
            onClose();
          }
        }}
        onMouseEnter={() => {
          if (hoverCapable.current) onOpen();
        }}
        className="flex items-center gap-1.5 py-2 uppercase tracking-[0.2em] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <span>{item.label}</span>
        {chevron(`h-3 w-3 transition-transform duration-300 ${open ? 'rotate-180' : ''}`)}
      </button>

      {open && (
        <div
          ref={panelRef}
          id={`nav-panel-${item.id}`}
          className={`absolute left-1/2 top-full z-50 max-w-[calc(100vw-48px)] -translate-x-1/2 border border-line bg-canvas py-2 shadow-xl ${
            groups.length > 1 ? 'w-[420px]' : 'w-64'
          }`}
          onMouseLeave={() => {
            if (hoverCapable.current) onClose();
          }}
          onKeyDown={event => {
            if (event.key === 'Escape') {
              event.preventDefault();
              onClose();
              triggerRef.current?.focus();
              return;
            }
            if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
            const links = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a') || []);
            if (!links.length) return;
            event.preventDefault();
            const index = links.indexOf(document.activeElement as HTMLElement);
            const next = event.key === 'ArrowDown'
              ? (index + 1) % links.length
              : (index - 1 + links.length) % links.length;
            links[next < 0 ? 0 : next].focus();
          }}
        >
          {groups.length > 1 ? (
            <div className="grid grid-cols-2 gap-x-4">
              {groups.map(([label, links], index) => (
                <div key={label || index} className={index > 0 ? 'border-l border-line/70 pl-2' : ''}>
                  {label && (
                    <span className="block px-4 py-1.5 text-[9px] uppercase tracking-[0.22em] text-cta">
                      {label}
                    </span>
                  )}
                  <div className="py-1">
                    {links.map(link => (
                      <a
                        key={`${link.href}-${link.label}`}
                        href={link.href}
                        onClick={onClose}
                        className="flex items-center justify-between gap-4 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-body transition-colors hover:bg-surface hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2"
                      >
                        <span>{link.label}</span>
                        {link.note ? (
                          <span className="text-[9px] normal-case tracking-normal text-body/80">{link.note}</span>
                        ) : (
                          <span aria-hidden="true" className="text-cta">→</span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-1">
              {children.map(link => (
                <a
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between gap-4 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-body transition-colors hover:bg-surface hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2"
                >
                  <span>{link.label}</span>
                  {link.note ? (
                    <span className="text-[9px] normal-case tracking-normal text-body/80">{link.note}</span>
                  ) : (
                    <span aria-hidden="true" className="text-cta">→</span>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAdmin,
  onOpenSources
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const hoverCapable = useRef(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    hoverCapable.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }, []);

  // One panel at a time, closed by a click anywhere outside the menu or by Escape.
  useEffect(() => {
    if (!openMenu) return;
    const handlePointer = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenMenu(null);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [openMenu]);

  // Escape closes the mobile overlay and returns focus to its toggle.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMobileMenuOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileMenuOpen]);

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onOpenCart();
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onOpenWishlist();
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const countChip = scrolled
    ? 'bg-cta text-ink'
    : 'bg-paper/15 text-paper backdrop-blur-sm';

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ease-in-out ${
          scrolled || mobileMenuOpen
            ? 'border-b border-line/70 bg-canvas/95 py-3 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent py-6'
        }`}
      >
        <div className="mx-auto flex max-w-[1580px] items-center justify-between px-6 md:px-8">

          {/* Brand Logo */}
          <a
            href={BRAND.homeHref}
            className="relative z-50 flex items-center gap-3 font-serif text-3xl font-medium tracking-tight text-paper transition-colors duration-300"
          >
            {/* Plate-free emblem, inked for the dark ground. Decorative: the
                wordmark beside it already names the link. */}
            <img
              src="/assets/brand/opar-seed-orbit-on-dark.png"
              alt=""
              width={32}
              height={32}
              className="h-[32px] w-[32px] object-contain"
            />
            {BRAND.wordmark}
          </a>

          {/* Desktop: the four sections from data/site.json */}
          <div
            ref={navRef}
            className="hidden items-center gap-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-body md:flex lg:gap-10"
          >
            {NAV_ITEMS.map(item =>
              item.children && item.children.filter(isPublished).length ? (
                <DesktopMenu
                  key={item.id}
                  item={item}
                  open={openMenu === item.id}
                  onOpen={() => setOpenMenu(item.id)}
                  onClose={() => setOpenMenu(current => (current === item.id ? null : current))}
                  onToggle={() => setOpenMenu(current => (current === item.id ? null : item.id))}
                  hoverCapable={hoverCapable}
                />
              ) : (
                <a
                  key={item.id}
                  href={item.href}
                  className="py-2 transition-opacity hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  {item.label}
                </a>
              )
            )}
          </div>

          {/* Right action: wishlist, cart, and the two internal controls */}
          <div className="relative z-50 flex items-center gap-3 text-paper sm:gap-5">

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistClick}
              className="flex min-h-[44px] items-center gap-1.5 p-1 text-[10px] font-semibold uppercase tracking-[0.2em] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              title="Saved Wishlist"
              aria-label={`Saved wishlist, ${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={wishlistCount > 0 ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={wishlistCount > 0 ? 0 : 1.5}
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span className="hidden sm:inline">Wishlist</span>
              <span className={`px-1.5 py-0.5 text-[10px] ${countChip}`}>
                {wishlistCount}
              </span>
            </button>

            {/* Cart Button */}
            <button
              onClick={handleCartClick}
              className="flex min-h-[44px] items-center gap-1.5 p-1 text-[10px] font-semibold uppercase tracking-[0.2em] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              title="Cart"
              aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="hidden sm:inline">Cart</span>
              <span className={`px-2 py-0.5 text-[10px] ${countChip}`}>
                {cartCount}
              </span>
            </button>

            {/* Internal controls. Deliberately outside the primary menu: they
                are utilities, not customer navigation destinations. */}
            <span aria-hidden="true" className="hidden h-5 w-px bg-line md:block" />

            {onOpenSources && (
              <button
                onClick={onOpenSources}
                className="hidden h-11 w-11 items-center justify-center text-body transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 md:flex"
                title="Lineage and sources"
                aria-label="Lineage and sources"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.25c-1.9-1.2-4.2-1.75-6.75-1.75H4v12h1.25c2.55 0 4.85.55 6.75 1.75m0-12c1.9-1.2 4.2-1.75 6.75-1.75H20v12h-1.25c-2.55 0-4.85.55-6.75 1.75m0-12v12" />
                </svg>
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              className="hidden h-11 w-11 items-center justify-center text-body transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 md:flex"
              title="Team access"
              aria-label="Team access"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.125a4.5 4.5 0 10-9 0V10.5m-.75 0h10.5a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5H6.75a1.5 1.5 0 01-1.5-1.5v-6a1.5 1.5 0 011.5-1.5z" />
              </svg>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              ref={toggleRef}
              className="flex h-11 w-11 items-center justify-center text-paper transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay — same four sections, same children, same order. */}
      <div
        id="mobile-navigation"
        className={`fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-canvas p-8 pt-28 text-paper transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-10 opacity-0'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col">
          {NAV_ITEMS.map(item => {
            const children = (item.children || []).filter(isPublished);
            const groups = groupChildren(children);

            if (!groups.length) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={closeMobileMenu}
                  tabIndex={mobileMenuOpen ? 0 : -1}
                  className="border-b border-line/60 py-4 font-serif text-xl text-paper transition-colors hover:text-cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {item.label}
                </a>
              );
            }

            return (
              <details key={item.id} className="group border-b border-line/60">
                <summary
                  tabIndex={mobileMenuOpen ? 0 : -1}
                  className="flex cursor-pointer list-none items-center justify-between py-4 font-serif text-xl text-paper transition-colors hover:text-cta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden"
                >
                  <span>{item.label}</span>
                  {chevron('h-3.5 w-3.5 text-cta transition-transform duration-300 group-open:rotate-180')}
                </summary>
                <div className="pb-5">
                  {groups.map(([label, links], index) => (
                    <div key={label || index} className={index > 0 ? 'mt-4' : ''}>
                      {label && (
                        <span className="mb-1 block text-[9px] uppercase tracking-[0.24em] text-cta">
                          {label}
                        </span>
                      )}
                      <div className="flex flex-col">
                        {links.map(link => (
                          <a
                            key={`${link.href}-${link.label}`}
                            href={link.href}
                            onClick={closeMobileMenu}
                            tabIndex={mobileMenuOpen ? 0 : -1}
                            className="flex items-center justify-between gap-3 py-2 font-serif text-lg text-body transition-colors hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                          >
                            <span>{link.label}</span>
                            {link.note ? (
                              <span className="text-[9px] uppercase tracking-[0.14em] text-body/70">{link.note}</span>
                            ) : (
                              <span aria-hidden="true" className="text-xs text-cta">→</span>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            );
          })}
        </nav>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <button
            onClick={handleWishlistClick}
            tabIndex={mobileMenuOpen ? 0 : -1}
            className="flex min-h-[44px] items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-cta"
          >
            <span>Wishlist ({wishlistCount})</span>
          </button>

          <button
            onClick={handleCartClick}
            tabIndex={mobileMenuOpen ? 0 : -1}
            className="flex min-h-[44px] items-center text-[10px] uppercase tracking-[0.2em] text-paper"
          >
            Cart ({cartCount})
          </button>

          <div className="flex items-center gap-5">
            {onOpenSources && (
              <button
                onClick={() => { closeMobileMenu(); onOpenSources(); }}
                tabIndex={mobileMenuOpen ? 0 : -1}
                className="flex min-h-[44px] items-center text-[10px] uppercase tracking-[0.2em] text-body"
              >
                Sources
              </button>
            )}
            <button
              onClick={() => { closeMobileMenu(); onOpenAdmin(); }}
              tabIndex={mobileMenuOpen ? 0 : -1}
              className="flex min-h-[44px] items-center text-[10px] uppercase tracking-[0.2em] text-body"
            >
              Team access
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
