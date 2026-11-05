/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types';
import { storeService } from '../services/storeService';
import ProductCard from './ProductCard';

const CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  'Ayurvedic Botanicals',
  'Sufi Mysticism & Marifat',
  'Yoga & Eastern Wisdom',
  'Philosophy & Existentialism',
  'Sacred Sound & Music',
  'Organic Quiet Tech'
];

interface ProductGridProps {
  onProductClick: (product: Product) => void;
  initialCategory?: ProductCategory | 'All';
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string) => void;
  onSelectCategory?: (slug: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  onProductClick, 
  initialCategory = 'All',
  wishlistIds = [],
  onToggleWishlist,
  onSelectCategory
}) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'All'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const products = storeService.getProducts();

  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    // Filter by Category
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    const sorted = [...result];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return sorted;
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <section id="products" className="py-28 px-6 md:px-12 bg-[#F5F2EB]">
      <div className="max-w-[1800px] mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#8C7355] font-medium">The Sacred Collection</span>
          <h2 className="text-4xl md:text-6xl font-serif text-[#2C2A26]">Objects for Bodhi & Stillness</h2>
          <p className="max-w-2xl text-base text-[#5D5A53] font-light leading-relaxed">
            Organic Ayurvedic herbs, sacred Sufi and Marifat masterworks, timeless yogic scriptures, 432Hz meditative sound, and tactile living tools crafted to alleviate desire and quiet the mind.
          </p>
          
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 pt-8 border-t border-[#D6D1C7]/60 w-full max-w-4xl">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs uppercase tracking-widest pb-1 border-b transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'border-[#2C2A26] text-[#2C2A26] font-medium' 
                    : 'border-transparent text-[#A8A29E] hover:text-[#2C2A26]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 mb-16 border-b border-[#D6D1C7]/50 max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <input 
              type="text"
              placeholder="Search Ashwagandha, Rumi, Baba Jahangir, Chishti, Nietzsche, 432Hz..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-[#A8A29E] py-2 pl-7 pr-3 text-xs text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26]"
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#A8A29E] absolute left-0 top-2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-0 top-2.5 text-xs text-[#A8A29E] hover:text-[#2C2A26]">
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs uppercase tracking-widest text-[#A8A29E]">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-b border-[#A8A29E] py-1 text-xs text-[#2C2A26] outline-none focus:border-[#2C2A26] uppercase tracking-wider cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Reverence</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <p className="font-serif text-2xl text-[#2C2A26]">No objects found matching &ldquo;{searchQuery}&rdquo;</p>
            <p className="text-xs text-[#5D5A53]">Try clearing your search query or exploring another sacred category.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="px-6 py-2.5 border border-[#2C2A26] text-xs uppercase tracking-widest text-[#2C2A26] hover:bg-[#2C2A26] hover:text-[#F5F2EB] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20">
            {filteredAndSortedProducts.map(product => (
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

      </div>
    </section>
  );
};

export default ProductGrid;
