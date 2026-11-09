/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Navigation. Category rooms and editorial sections are generated static
 * pages, so every destination here is a real URL; the shell keeps only the
 * cart, wishlist and team-access overlays.
 */

import React, { useState, useEffect, useRef } from 'react';
import { BRAND_NAME, SHOP_ROOMS } from '../constants';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  onOpenSources?: () => void;
}

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
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            href="/"
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
            {BRAND_NAME}
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-body md:flex lg:gap-10">

            {/* Category rooms */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
            >
              <button
                type="button"
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                aria-expanded={categoriesDropdownOpen}
                className="flex items-center gap-1.5 py-2 uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
              >
                <span>Categories</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-3 w-3 transition-transform duration-300 ${categoriesDropdownOpen ? 'rotate-180' : ''}`}
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {categoriesDropdownOpen && (
                <div
                  className="absolute left-0 top-full z-50 w-64 border border-line bg-canvas py-2 shadow-xl animate-fade-in"
                  onMouseLeave={() => setCategoriesDropdownOpen(false)}
                >
                  <div className="border-b border-line/70 px-4 py-1.5">
                    <span className="block text-[9px] uppercase tracking-[0.22em] text-cta">
                      The rooms
                    </span>
                  </div>

                  <div className="py-1">
                    {SHOP_ROOMS.map((room) => (
                      <a
                        key={room.slug}
                        href={`/shop/${room.slug}/`}
                        className="flex items-center justify-between px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-body transition-colors hover:bg-surface hover:text-paper"
                      >
                        <span>{room.title}</span>
                        <span aria-hidden="true" className="text-cta">→</span>
                      </a>
                    ))}
                  </div>

                  <div className="border-t border-line/70 px-4 pt-2">
                    <a
                      href="/shop/"
                      className="block py-1 text-[10px] uppercase tracking-[0.16em] text-cta transition-colors hover:text-paper"
                    >
                      All rooms →
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a href="/shop/" className="transition-opacity hover:opacity-60">Shop</a>
            <a href="/discover/" className="transition-opacity hover:opacity-60">Discover</a>
            <a href="/about/" className="transition-opacity hover:opacity-60">Our Story</a>
            <a href="/journal/" className="transition-opacity hover:opacity-60">Journal</a>

            {onOpenSources && (
              <button
                onClick={onOpenSources}
                className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cta transition-opacity hover:opacity-70"
              >
                Lineage &amp; Sources
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cta/80 transition-opacity hover:opacity-70"
              title="Team access"
            >
              <span>Admin</span>
            </button>
          </div>

          {/* Right Action: Wishlist & Cart */}
          <div className="relative z-50 flex items-center gap-4 text-paper sm:gap-6">

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistClick}
              className="flex items-center gap-1.5 p-1 text-[10px] font-semibold uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
              title="Saved Wishlist"
              aria-label="Saved Wishlist"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={wishlistCount > 0 ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={wishlistCount > 0 ? 0 : 1.5}
                className="h-4 w-4"
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
              className="flex items-center gap-1.5 p-1 text-[10px] font-semibold uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="hidden sm:inline">Cart</span>
              <span className={`px-2 py-0.5 text-[10px] ${countChip}`}>
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="block text-paper transition-colors duration-300 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-canvas p-8 pt-28 text-paper transition-all duration-500 ease-in-out ${
        mobileMenuOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-10 opacity-0'
      }`}>
        <div className="flex flex-col space-y-6">
          <div className="border-b border-line pb-5">
            <span className="mb-3 block text-[9px] uppercase tracking-[0.24em] text-cta">
              The rooms
            </span>
            <div className="space-y-3">
              {SHOP_ROOMS.map((room) => (
                <a
                  key={room.slug}
                  href={`/shop/${room.slug}/`}
                  className="flex items-center justify-between font-serif text-xl text-paper transition-colors hover:text-cta"
                >
                  <span>{room.title}</span>
                  <span aria-hidden="true" className="text-xs text-cta">→</span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-4 font-serif text-xl text-paper">
            <a href="/shop/" className="transition-opacity hover:opacity-60">Shop</a>
            <a href="/discover/" className="transition-opacity hover:opacity-60">Discover partner offers</a>
            <a href="/about/" className="transition-opacity hover:opacity-60">Our Story</a>
            <a href="/journal/" className="transition-opacity hover:opacity-60">Journal</a>
            {onOpenSources && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenSources(); }}
                className="text-left transition-opacity hover:opacity-60 text-cta"
              >
                Lineage &amp; Sources Directory
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line pt-6">
          <button
            onClick={handleWishlistClick}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-cta"
          >
            <span>Wishlist ({wishlistCount})</span>
          </button>

          <button
            onClick={handleCartClick}
            className="text-[10px] uppercase tracking-[0.2em] text-paper"
          >
            Cart ({cartCount})
          </button>

          <button
            onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
            className="text-[10px] uppercase tracking-[0.2em] text-cta"
          >
            Admin
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
