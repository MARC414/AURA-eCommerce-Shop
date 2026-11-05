/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo } from 'react';
import { Product, CategoryInfo } from '../types';
import { CATEGORIES_CATALOG } from '../constants';
import ProductCard from './ProductCard';

interface CategoryPageProps {
  categorySlug: string;
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onProductClick: (product: Product) => void;
  onBackToHome: () => void;
  onSelectCategory: (slug: string) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug,
  products,
  wishlistIds,
  onToggleWishlist,
  onProductClick,
  onBackToHome,
  onSelectCategory,
}) => {
  const [activeSubcategory, setActiveSubcategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  // Find category metadata
  const categoryMeta: CategoryInfo = useMemo(() => {
    return (
      CATEGORIES_CATALOG.find((c) => c.slug === categorySlug) ||
      CATEGORIES_CATALOG[0]
    );
  }, [categorySlug]);

  // Filter products matching this category
  const categoryProducts = useMemo(() => {
    return products.filter((p) => categoryMeta.matchesProduct(p));
  }, [products, categoryMeta]);

  // Apply subcategory and search filters
  const filteredProducts = useMemo(() => {
    let result = categoryProducts;

    // Subcategory filter
    if (activeSubcategory !== 'All') {
      result = result.filter((p) => {
        if (p.category === activeSubcategory) return true;
        if (p.variants?.some((v) => v.toLowerCase().includes(activeSubcategory.toLowerCase()))) return true;
        if (p.features?.some((f) => f.toLowerCase().includes(activeSubcategory.toLowerCase()))) return true;
        if (p.description.toLowerCase().includes(activeSubcategory.toLowerCase())) return true;
        return false;
      });
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.authenticScript && p.authenticScript.toLowerCase().includes(q)) ||
          (p.botanicalLatin && p.botanicalLatin.toLowerCase().includes(q)) ||
          (p.traditionalTcm && p.traditionalTcm.toLowerCase().includes(q)) ||
          (p.bengaliName && p.bengaliName.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q)
      );
    }

    // Sort
    const sorted = [...result];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sorted;
  }, [categoryProducts, activeSubcategory, searchQuery, sortBy]);

  // Other categories for footer cross-navigation
  const otherCategories = useMemo(() => {
    return CATEGORIES_CATALOG.filter((c) => c.slug !== categoryMeta.slug);
  }, [categoryMeta]);

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#F5F2EB]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#8C7355] uppercase mb-8">
          <button 
            onClick={onBackToHome}
            className="hover:text-[#2C2A26] transition-colors flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Sanctuary Home</span>
          </button>
          <span>/</span>
          <span>Collections</span>
          <span>/</span>
          <span className="text-[#2C2A26] font-medium">{categoryMeta.title}</span>
        </nav>

        {/* Editorial Header Section */}
        <div className="border-b border-[#D6D1C7] pb-12 mb-12">
          <div className="max-w-4xl space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#8C7355] font-mono">
              Dedicated Collection
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-[#2C2A26] leading-tight">
              {categoryMeta.title}
            </h1>

            <p className="text-base md:text-lg text-[#5D5A53] font-light leading-relaxed">
              {categoryMeta.tagline}
            </p>

            {/* Sacred Wisdom Quote */}
            <div className="p-6 my-6 bg-[#EBE7DE]/70 border-l-2 border-[#8C7355] space-y-2">
              {categoryMeta.quoteOriginalScript && (
                <p className="font-serif text-lg text-[#8C7355] leading-relaxed mb-1 dir-auto">
                  {categoryMeta.quoteOriginalScript}
                </p>
              )}
              <p className="font-serif italic text-base text-[#2C2A26] leading-relaxed">
                "{categoryMeta.quote}"
              </p>
              <cite className="block text-xs uppercase tracking-widest font-mono text-[#8C7355] not-italic">
                — {categoryMeta.quoteAuthor}
              </cite>
            </div>

            <p className="text-sm text-[#5D5A53] font-light leading-relaxed">
              {categoryMeta.description}
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#D6D1C7]/60 mb-10">
          
          {/* Subcategory Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categoryMeta.subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSubcategory(sub)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all ${
                  activeSubcategory === sub
                    ? 'bg-[#2C2A26] text-[#F5F2EB]'
                    : 'bg-white text-[#5D5A53] border border-[#D6D1C7] hover:border-[#2C2A26] hover:text-[#2C2A26]'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Instant Search within category */}
            <div className="relative min-w-[240px]">
              <input
                type="text"
                placeholder="Search in this collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#D6D1C7] text-xs text-[#2C2A26] focus:outline-none focus:border-[#2C2A26] transition-colors"
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7355]"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 bg-white border border-[#D6D1C7] text-xs text-[#2C2A26] font-mono focus:outline-none focus:border-[#2C2A26]"
            >
              <option value="featured">Sort: Curated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Product Count & Active Filters Indicator */}
        <div className="flex items-center justify-between text-xs text-[#5D5A53] font-mono mb-8">
          <span>
            Showing {filteredProducts.length} of {categoryProducts.length} items
          </span>
          {activeSubcategory !== 'All' && (
            <button
              onClick={() => setActiveSubcategory('All')}
              className="text-[#8C7355] underline hover:text-[#2C2A26]"
            >
              Reset filter
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/60 border border-[#D6D1C7] p-8 space-y-4">
            <p className="font-serif text-xl text-[#2C2A26]">No objects found matching your search</p>
            <p className="text-xs text-[#5D5A53] font-light">Try selecting a different filter or clearing your search query.</p>
            <button
              onClick={() => {
                setActiveSubcategory('All');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 bg-[#2C2A26] text-[#F5F2EB] text-xs uppercase tracking-widest font-medium"
            >
              View All {categoryMeta.title}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onClick={onProductClick}
              />
            ))}
          </div>
        )}

        {/* Navigation to Other Collections */}
        <div className="mt-24 pt-16 border-t border-[#D6D1C7]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7355]">
                Cross-Discipline Exploration
              </span>
              <h3 className="text-2xl font-serif text-[#2C2A26] mt-1">
                Explore Other Sanctuary Pillars
              </h3>
            </div>
            
            <button
              onClick={onBackToHome}
              className="text-xs uppercase tracking-widest font-medium text-[#2C2A26] hover:text-[#8C7355] transition-colors underline"
            >
              All Collections
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherCategories.map((c) => (
              <div
                key={c.slug}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  onSelectCategory(c.slug);
                }}
                className="p-6 bg-white border border-[#D6D1C7] hover:border-[#2C2A26] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7355]">
                    Pillar
                  </span>
                  <h4 className="font-serif text-lg text-[#2C2A26] group-hover:text-[#8C7355] transition-colors mt-1">
                    {c.title}
                  </h4>
                  {c.bengaliTitle && (
                    <p className="text-xs font-serif text-[#8C7355] italic mt-0.5">
                      {c.bengaliTitle}
                    </p>
                  )}
                  <p className="text-xs text-[#5D5A53] font-light line-clamp-2 mt-2 leading-relaxed">
                    {c.tagline}
                  </p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-[#EBE7DE] flex items-center justify-between text-xs text-[#8C7355] group-hover:text-[#2C2A26]">
                  <span className="uppercase tracking-widest font-medium text-[11px]">Enter Collection</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CategoryPage;
