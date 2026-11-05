/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { BRAND_NAME, CATEGORIES_CATALOG } from '../constants';

interface NavbarProps {
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onSelectCategory: (categorySlug: string) => void;
  onOpenAdmin: () => void;
  onOpenSources?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onNavClick, 
  cartCount, 
  wishlistCount,
  onOpenCart, 
  onOpenWishlist,
  onSelectCategory,
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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
    onNavClick(e, targetId);
  };

  const handleCategoryClick = (slug: string) => {
    setCategoriesDropdownOpen(false);
    setMobileMenuOpen(false);
    onSelectCategory(slug);
  };

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

  const textColorClass = (scrolled || mobileMenuOpen) ? 'text-[#2C2A26]' : 'text-[#F5F2EB]';

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
          scrolled || mobileMenuOpen ? 'bg-[#F5F2EB]/95 backdrop-blur-md py-4 shadow-sm border-b border-[#D6D1C7]/60' : 'bg-transparent py-8'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-6 md:px-8 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onNavClick(e, '');
            }}
            className={`text-3xl font-serif font-medium tracking-tight z-50 relative transition-colors duration-500 ${textColorClass}`}
          >
            {BRAND_NAME}
          </a>
          
          {/* Desktop Navigation Links */}
          <div className={`hidden md:flex items-center gap-8 lg:gap-10 text-xs font-medium tracking-widest uppercase transition-colors duration-500 ${textColorClass}`}>
            
            {/* Categories Dropdown */}
            <div 
              ref={dropdownRef} 
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
            >
              <button
                type="button"
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className="hover:opacity-60 transition-opacity flex items-center gap-1.5 py-2 uppercase tracking-widest"
              >
                <span>Categories</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${categoriesDropdownOpen ? 'rotate-180' : ''}`}
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Submenu Floating Panel */}
              {categoriesDropdownOpen && (
                <div 
                  className="absolute top-full left-0 w-64 bg-[#F5F2EB] border border-[#D6D1C7] shadow-xl py-2 z-50 transition-all duration-300 animate-fadeIn"
                  onMouseLeave={() => setCategoriesDropdownOpen(false)}
                >
                  <div className="px-4 py-1.5 border-b border-[#D6D1C7]/60">
                    <span className="text-[10px] font-mono tracking-widest text-[#8C7355] uppercase block">
                      Categories
                    </span>
                  </div>

                  <div className="py-1">
                    {CATEGORIES_CATALOG.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => handleCategoryClick(cat.slug)}
                        className="w-full text-left px-4 py-2 hover:bg-[#EBE7DE] transition-colors flex items-center justify-between group"
                      >
                        <span className="text-xs font-serif text-[#2C2A26] group-hover:text-[#8C7355] transition-colors">
                          {cat.title}
                        </span>
                        <span className="text-[10px] text-[#8C7355] opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="px-4 pt-2 border-t border-[#D6D1C7]/60">
                    <a
                      href="#products"
                      onClick={(e) => handleLinkClick(e, 'products')}
                      className="text-[11px] font-mono text-[#8C7355] hover:text-[#2C2A26] block py-1 uppercase tracking-wider"
                    >
                      View All Products Grid →
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a href="/shop/" className="hover:opacity-60 transition-opacity">Shop</a>
            <a href="/discover/" className="hover:opacity-60 transition-opacity">Discover</a>
            <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="hover:opacity-60 transition-opacity">Our Story</a>
            <a href="#journal" onClick={(e) => handleLinkClick(e, 'journal')} className="hover:opacity-60 transition-opacity">Journal</a>
            
            {onOpenSources && (
              <button 
                onClick={onOpenSources}
                className="hover:opacity-60 transition-opacity text-xs font-medium uppercase tracking-widest text-[#8C7355]"
              >
                Lineage & Sources
              </button>
            )}

            <button 
              onClick={onOpenAdmin}
              className="text-xs font-medium uppercase tracking-widest text-[#8C7355] hover:opacity-80 transition-opacity flex items-center gap-1.5"
              title="Store Owner & Dropship Management Portal"
            >
              <span>Admin</span>
            </button>
          </div>

          {/* Right Action: Wishlist & Cart */}
          <div className={`flex items-center gap-4 sm:gap-6 z-50 relative transition-colors duration-500 ${textColorClass}`}>
            
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistClick}
              className="text-xs font-medium uppercase tracking-widest hover:opacity-70 transition-opacity flex items-center gap-1.5 p-1"
              title="Saved Wishlist"
              aria-label="Saved Wishlist"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill={wishlistCount > 0 ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                strokeWidth={wishlistCount > 0 ? 0 : 1.5} 
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span className="hidden sm:inline">Wishlist</span>
              <span className={`px-1.5 py-0.5 text-[10px] font-mono ${scrolled ? 'bg-[#8C7355] text-[#F5F2EB]' : 'bg-white/20 text-white backdrop-blur-sm'}`}>
                {wishlistCount}
              </span>
            </button>

            {/* Cart Button */}
            <button 
              onClick={handleCartClick}
              className="text-xs font-medium uppercase tracking-widest hover:opacity-70 transition-opacity flex items-center gap-1.5 p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="hidden sm:inline">Cart</span>
              <span className={`px-2 py-0.5 text-[10px] font-mono ${scrolled ? 'bg-[#2C2A26] text-[#F5F2EB]' : 'bg-white/20 text-white backdrop-blur-sm'}`}>
                {cartCount}
              </span>
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              className={`block md:hidden focus:outline-none transition-colors duration-500 ${textColorClass}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[#F5F2EB] z-40 flex flex-col justify-between p-8 pt-28 overflow-y-auto transition-all duration-500 ease-in-out ${
        mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-10 pointer-events-none'
      }`}>
        <div className="flex flex-col space-y-6">
          <div className="border-b border-[#D6D1C7] pb-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7355] block mb-2">
              Browse Categories
            </span>
            <div className="space-y-3">
              {CATEGORIES_CATALOG.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="w-full text-left font-serif text-xl text-[#2C2A26] hover:text-[#8C7355] flex items-center justify-between"
                >
                  <span>{cat.title}</span>
                  <span className="text-xs text-[#8C7355]">→</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-4 text-xl font-serif text-[#2C2A26]">
            <a href="/shop/" className="hover:opacity-60 transition-opacity">Shop preview</a>
            <a href="/discover/" className="hover:opacity-60 transition-opacity">Discover external offers</a>
            <a href="#products" onClick={(e) => handleLinkClick(e, 'products')} className="hover:opacity-60 transition-opacity">All Products</a>
            <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="hover:opacity-60 transition-opacity">Our Story</a>
            <a href="#journal" onClick={(e) => handleLinkClick(e, 'journal')} className="hover:opacity-60 transition-opacity">Journal & Discourses</a>
            {onOpenSources && (
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenSources(); }}
                className="text-left hover:opacity-60 transition-opacity text-[#8C7355]"
              >
                Lineage & Sources Directory
              </button>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-[#D6D1C7] flex items-center justify-between">
          <button 
            onClick={handleWishlistClick} 
            className="text-xs uppercase tracking-widest font-mono text-[#8C7355] flex items-center gap-1.5"
          >
            <span>Wishlist ({wishlistCount})</span>
          </button>
          
          <button 
            onClick={handleCartClick} 
            className="text-xs uppercase tracking-widest font-mono text-[#2C2A26]"
          >
            Cart ({cartCount})
          </button>

          <button 
            onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
            className="text-xs uppercase tracking-widest font-mono text-[#8C7355]"
          >
            Admin
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
