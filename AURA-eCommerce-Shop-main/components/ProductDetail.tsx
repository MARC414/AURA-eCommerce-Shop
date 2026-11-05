/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { Product, Review } from '../types';
import { storeService } from '../services/storeService';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, variant?: string) => void;
  onProductClick: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onBack, 
  onAddToCart, 
  onProductClick,
  isWishlisted = false,
  onToggleWishlist
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(product.imageUrl);
  const [selectedVariant, setSelectedVariant] = useState<string>(
    product.variants && product.variants.length > 0 ? product.variants[0] : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'ritual' | 'shipping'>('details');

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(storeService.getReviews(product.id));
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');

  // Related products
  const allProducts = storeService.getProducts();
  const relatedProducts = allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);
  const fallbackRelated = relatedProducts.length > 0 ? relatedProducts : allProducts.filter(p => p.id !== product.id).slice(0, 3);

  // Dynamic delivery dates (Current date + 7 to 12 business days)
  const deliveryStart = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const deliveryEnd = new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Web Audio 432Hz Sacred Acoustic Synthesizer
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const stopAudioRef = React.useRef<(() => void) | null>(null);

  const toggleAudioPreview = () => {
    if (isPlayingAudio) {
      if (stopAudioRef.current) stopAudioRef.current();
      setIsPlayingAudio(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.8);
      masterGain.connect(ctx.destination);

      const baseFreq = product.id.includes('bowl') ? 432 : product.id.includes('ney') ? 324 : 288;
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime);

      oscHarmonic.type = 'sine';
      oscHarmonic.frequency.setValueAtTime(baseFreq * 2, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      oscHarmonic.connect(filter);
      filter.connect(masterGain);

      osc1.start();
      osc2.start();
      oscHarmonic.start();

      stopAudioRef.current = () => {
        try {
          masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
          masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
          setTimeout(() => {
            try {
              osc1.stop();
              osc2.stop();
              oscHarmonic.stop();
              ctx.close();
            } catch (e) {}
          }, 700);
        } catch (e) {}
      };

      setIsPlayingAudio(true);
    } catch (err) {
      console.warn('Audio preview not supported in this browser context', err);
    }
  };

  React.useEffect(() => {
    return () => {
      if (stopAudioRef.current) {
        stopAudioRef.current();
      }
    };
  }, [product.id]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewerComment) return;

    storeService.addReview({
      productId: product.id,
      author: reviewerName,
      rating: reviewerRating,
      comment: reviewerComment
    });

    setReviews(storeService.getReviews(product.id));
    setReviewerName('');
    setReviewerComment('');
    setIsReviewModalOpen(false);
  };

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.imageUrl];

  return (
    <div className="pt-24 min-h-screen bg-[#F5F2EB] animate-fade-in-up">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 pb-24">
        
        {/* Breadcrumb Back */}
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#A8A29E] hover:text-[#2C2A26] transition-colors mb-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Collection
        </button>

        {/* 2-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-28">
          
          {/* Left Column: Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="w-full aspect-[4/5] bg-[#EBE7DE] overflow-hidden relative shadow-sm">
              <img 
                src={selectedImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-all duration-700 ease-in-out"
              />
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-24 bg-[#EBE7DE] overflow-hidden border transition-all flex-shrink-0 ${
                      selectedImage === img ? 'border-[#2C2A26] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Purchase Module (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            
            {/* Category & Ratings */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest text-[#A8A29E] font-medium">{product.category}</span>
              <div className="flex items-center gap-2 text-xs text-[#5D5A53]">
                <div className="flex text-[#8C7355]">
                  {'★'.repeat(Math.round(product.rating || 5))}
                </div>
                <span>({reviews.length} Reviews)</span>
              </div>
            </div>

            {/* Title & Tagline */}
            <h1 className="text-4xl md:text-5xl font-serif text-[#2C2A26] mb-2">{product.name}</h1>
            {product.authenticScript ? (
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xl font-serif text-[#8C7355] tracking-wide font-normal">
                  {product.authenticScript}
                </span>
                {product.scriptLanguage && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#EBE7DE] text-[#8C7355] border border-[#D6D1C7]">
                    {product.scriptLanguage}
                  </span>
                )}
                {product.botanicalLatin && (
                  <span className="text-xs font-serif italic text-[#A8A29E]">
                    Botanical: {product.botanicalLatin}
                  </span>
                )}
                {product.traditionalTcm && (
                  <span className="text-xs font-serif text-[#8C7355] border-l border-[#D6D1C7] pl-2">
                    TCM: {product.traditionalTcm}
                  </span>
                )}
              </div>
            ) : product.bengaliName ? (
              <p className="text-lg font-serif text-[#8C7355] italic mb-3 font-normal">
                {product.bengaliName}
              </p>
            ) : null}
            <p className="text-sm font-light text-[#8C7355] italic mb-4">{product.tagline}</p>

            {/* Badges for Format & Language */}
            {(product.format || product.language) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {product.format && (
                  <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider bg-[#EBE7DE] text-[#2C2A26] border border-[#D6D1C7]">
                    Edition: {product.format}
                  </span>
                )}
                {product.language && (
                  <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider bg-[#EBE7DE] text-[#8C7355] border border-[#D6D1C7]">
                    Language: {product.language}
                  </span>
                )}
              </div>
            )}

            {/* Sacred Audio Sound Sample Player for Sacred Sound & Music */}
            {(product.category === 'Sacred Sound & Music' || product.format === 'Digital Download' || product.id.includes('bowl')) && (
              <div className="mb-8 p-5 bg-[#EBE7DE]/70 border border-[#D6D1C7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8C7355]"></span>
                    <span className="text-[10px] uppercase tracking-widest text-[#8C7355] font-semibold">
                      Sacred Acoustic Resonance
                    </span>
                  </div>
                  <h4 className="font-serif text-[#2C2A26] text-sm">
                    {product.id.includes('bowl') ? '432Hz Himalayan Bell Bronze Tone' : 'Acoustic Meditative Flute & Drone'}
                  </h4>
                  <p className="text-[11px] text-[#5D5A53] font-light">
                    Pure harmonic frequency preview synthesized in real-time.
                  </p>
                </div>

                <button
                  onClick={toggleAudioPreview}
                  className={`px-5 py-2.5 text-xs uppercase tracking-widest font-medium transition-all flex items-center justify-center gap-2 border ${
                    isPlayingAudio
                      ? 'bg-[#2C2A26] text-[#F5F2EB] border-[#2C2A26]'
                      : 'bg-white text-[#2C2A26] border-[#D6D1C7] hover:border-[#2C2A26]'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                      <span>Stop Sound</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#8C7355]">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      <span>Play 432Hz Preview</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8 pb-6 border-b border-[#D6D1C7]">
              <span className="text-3xl font-serif text-[#2C2A26] tabular-nums">${product.price} USD</span>
              <span className="text-xs text-[#5D5A53]">Complimentary insured global delivery</span>
            </div>

            {/* Description */}
            <p className="text-[#5D5A53] leading-relaxed font-light text-base mb-8">
              {product.longDescription || product.description}
            </p>

            {/* Sourcing Badge */}
            {product.origin && (
              <div className="mb-8 p-4 bg-[#EBE7DE]/40 border border-[#D6D1C7] flex items-center gap-3 text-xs text-[#5D5A53]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#8C7355]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>Origin Transparency: <strong>{product.origin}</strong></span>
              </div>
            )}

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <span className="block text-xs uppercase tracking-widest text-[#2C2A26] mb-3 font-medium">Select Specification</span>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v) => (
                    <button 
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2.5 text-xs tracking-wider border transition-all ${
                        selectedVariant === v 
                          ? 'border-[#2C2A26] bg-[#2C2A26] text-[#F5F2EB]' 
                          : 'border-[#D6D1C7] text-[#5D5A53] hover:border-[#2C2A26]'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Stock */}
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center border border-[#D6D1C7] bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-sm text-[#5D5A53] hover:text-[#2C2A26] transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-3 text-sm font-mono text-[#2C2A26] min-w-[40px] text-center">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-sm text-[#5D5A53] hover:text-[#2C2A26] transition-colors"
                >
                  +
                </button>
              </div>

              {/* Stock Indicator */}
              <div className="text-xs text-[#5D5A53] flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-600' : 'bg-amber-600 animate-pulse'}`}></span>
                {product.stock > 10 ? (
                  <span>In Stock — Dispatches within 24–48 hours</span>
                ) : (
                  <span className="text-amber-800 font-medium">Low Stock: Only {product.stock} units remaining</span>
                )}
              </div>
            </div>

            {/* Add to Cart CTA & Wishlist */}
            <div className="space-y-4 mb-10">
              <div className="flex gap-3">
                <button 
                  onClick={() => onAddToCart(product, quantity, selectedVariant)}
                  className="flex-1 py-5 bg-[#2C2A26] text-[#F5F2EB] uppercase tracking-widest text-xs font-medium hover:bg-[#433E38] transition-colors flex items-center justify-center gap-3 shadow-sm"
                >
                  <span>Add to Sanctuary Cart — ${product.price * quantity} USD</span>
                </button>
                {onToggleWishlist && (
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product.id)}
                    className={`px-6 py-5 border transition-all flex items-center justify-center gap-2 ${
                      isWishlisted
                        ? 'bg-[#8C7355] text-white border-[#8C7355]'
                        : 'bg-white text-[#2C2A26] border-[#D6D1C7] hover:border-[#2C2A26]'
                    }`}
                    title={isWishlisted ? 'Saved in your wishlist' : 'Save to wishlist'}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill={isWishlisted ? 'currentColor' : 'none'} 
                      stroke="currentColor" 
                      strokeWidth={isWishlisted ? 0 : 1.5} 
                      className="w-5 h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    <span className="hidden sm:inline text-xs uppercase tracking-widest font-medium">
                      {isWishlisted ? 'Saved' : 'Wishlist'}
                    </span>
                  </button>
                )}
              </div>

              {/* Dynamic Delivery Window */}
              <div className="p-4 bg-white/70 border border-[#D6D1C7] text-xs text-[#5D5A53] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#8C7355]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.948c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75" />
                  </svg>
                  <span>Estimated Delivery Window:</span>
                </div>
                <strong className="text-[#2C2A26] font-medium">{deliveryStart} – {deliveryEnd}</strong>
              </div>
            </div>

            {/* Key Features List */}
            <ul className="space-y-2.5 text-xs text-[#5D5A53] pt-4 border-t border-[#D6D1C7]">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-[#8C7355] rounded-full"></span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

          </div>

        </div>

        {/* TABS SECTION: DETAILS, RITUAL, SHIPPING */}
        <div className="mb-24 border-t border-[#D6D1C7] pt-16">
          <div className="flex border-b border-[#D6D1C7] gap-8 mb-10 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('details')}
              className={`pb-4 text-xs uppercase tracking-widest font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'details' ? 'border-[#2C2A26] text-[#2C2A26]' : 'border-transparent text-[#A8A29E] hover:text-[#2C2A26]'
              }`}
            >
              Origin & Composition
            </button>
            <button 
              onClick={() => setActiveTab('ritual')}
              className={`pb-4 text-xs uppercase tracking-widest font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'ritual' ? 'border-[#2C2A26] text-[#2C2A26]' : 'border-transparent text-[#A8A29E] hover:text-[#2C2A26]'
              }`}
            >
              Daily Ritual & Usage
            </button>
            <button 
              onClick={() => setActiveTab('shipping')}
              className={`pb-4 text-xs uppercase tracking-widest font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'shipping' ? 'border-[#2C2A26] text-[#2C2A26]' : 'border-transparent text-[#A8A29E] hover:text-[#2C2A26]'
              }`}
            >
              Dropship Shipping & 30-Day Guarantee
            </button>
          </div>

          <div className="max-w-4xl text-[#5D5A53] font-light leading-relaxed text-sm">
            {activeTab === 'details' && (
              <div className="space-y-4 animate-fade-in">
                <p>
                  At Aura, we reject synthetic compromises. Every botanical ingredient is harvested in tandem with biological seasons, and all structural materials (from Mediterranean oak cork to high-fired porcelain) are selected for longevity and sensory presence.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div className="p-6 bg-white border border-[#D6D1C7]">
                    <h4 className="font-serif text-[#2C2A26] text-base mb-2">Sustainable Harvesting</h4>
                    <p className="text-xs">Zero deforestation, non-toxic water-based extraction, and 100% recyclable glass and unbleached paper packaging.</p>
                  </div>
                  <div className="p-6 bg-white border border-[#D6D1C7]">
                    <h4 className="font-serif text-[#2C2A26] text-base mb-2">Clean Third-Party Tested</h4>
                    <p className="text-xs">Independently verified for heavy metals, microbial purity, and absolute zero synthetic fillers or binders.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ritual' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-serif text-[#2C2A26] text-xl">The Slow Living Ritual</h3>
                <p>
                  Mindfulness is not an appointment; it is how you transition between states of being. We recommend incorporating this piece into your morning awakening or evening twilight wind-down.
                </p>
                <ol className="list-decimal pl-5 space-y-2 pt-2 text-xs">
                  <li><strong>Preparation:</strong> Disconnect from digital notifications and clear the physical surface of clutter.</li>
                  <li><strong>Sensory Engagement:</strong> Notice the tactile texture—the cool touch of sandstone, the grain of cork, or the aroma of botanical roots.</li>
                  <li><strong>Breath:</strong> Take three full, diaphragmatic breaths before beginning your practice or consuming your tonic.</li>
                </ol>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-serif text-[#2C2A26] text-xl">Direct Dropship Fulfillment</h3>
                <p>
                  Your parcel is dispatched within 24 to 48 hours directly from our regional atelier to eliminate excess carbon footprint. Standard transit is fully tracked via USPS, Royal Mail, or YunExpress and arrives within 7 to 12 business days worldwide.
                </p>
                <p className="text-xs pt-2">
                  <strong>30-Day Money-Back Guarantee:</strong> If this piece does not bring stillness to your environment, return it within 30 days for a 100% refund without question.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="mb-28 border-t border-[#D6D1C7] pt-16">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8C7355] font-medium block mb-1">Customer Experiences</span>
              <h2 className="text-3xl font-serif text-[#2C2A26]">Verified Buyer Reflections</h2>
            </div>
            
            <button 
              onClick={() => setIsReviewModalOpen(true)}
              className="px-6 py-3 border border-[#2C2A26] text-[#2C2A26] text-xs uppercase tracking-widest font-medium hover:bg-[#2C2A26] hover:text-[#F5F2EB] transition-colors self-start"
            >
              Write a Review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-8 bg-white border border-[#D6D1C7] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[#8C7355] text-sm">{'★'.repeat(rev.rating)}</span>
                    <span className="text-xs text-[#A8A29E]">{rev.date}</span>
                  </div>
                  <p className="text-sm text-[#5D5A53] font-light leading-relaxed mb-6">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-[#D6D1C7]/60 text-xs">
                  <span className="font-serif text-[#2C2A26] font-medium">{rev.author}</span>
                  {rev.verified && (
                    <span className="text-emerald-800 text-[10px] uppercase tracking-wider font-mono">· Verified Buyer</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* WRITE REVIEW MODAL */}
          {isReviewModalOpen && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#2C2A26]/50 backdrop-blur-sm animate-fade-in">
              <div className="relative w-full max-w-lg bg-[#F5F2EB] border border-[#D6D1C7] shadow-2xl p-8 animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-serif text-[#2C2A26] text-2xl">Share Your Experience</h3>
                  <button onClick={() => setIsReviewModalOpen(false)} className="text-[#A8A29E] hover:text-[#2C2A26]">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddReview} className="space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">Your Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Maya S."
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full bg-white border border-[#D6D1C7] p-3 text-sm text-[#2C2A26] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">Rating</label>
                    <select 
                      value={reviewerRating}
                      onChange={(e) => setReviewerRating(Number(e.target.value))}
                      className="w-full bg-white border border-[#D6D1C7] p-3 text-sm text-[#2C2A26] outline-none"
                    >
                      <option value={5}>★★★★★ (5 Stars — Exceptional)</option>
                      <option value={4}>★★★★☆ (4 Stars — Grounded)</option>
                      <option value={3}>★★★☆☆ (3 Stars — Average)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-widest text-[#5D5A53] block mb-1">Your Review</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="How has this piece grounded your daily routine?"
                      value={reviewerComment}
                      onChange={(e) => setReviewerComment(e.target.value)}
                      className="w-full bg-white border border-[#D6D1C7] p-3 text-sm text-[#2C2A26] outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setIsReviewModalOpen(false)}
                      className="px-5 py-2.5 border border-[#D6D1C7] text-xs uppercase tracking-widest text-[#5D5A53]"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-2.5 bg-[#2C2A26] text-[#F5F2EB] text-xs uppercase tracking-widest font-medium"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* RELATED PRODUCTS STRIP */}
        <div className="border-t border-[#D6D1C7] pt-16">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#8C7355] block mb-1 font-medium">Harmonious Pairings</span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#2C2A26]">Frequently Paired With</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fallbackRelated.map(item => (
              <div 
                key={item.id} 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  onProductClick(item);
                }}
                className="group cursor-pointer flex flex-col"
              >
                <div className="w-full aspect-[4/5] bg-[#EBE7DE] overflow-hidden mb-6 relative">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <span className="text-xs uppercase tracking-widest text-[#A8A29E] mb-1">{item.category}</span>
                <h3 className="font-serif text-xl text-[#2C2A26] mb-1 group-hover:opacity-70 transition-opacity">{item.name}</h3>
                <span className="text-sm font-serif text-[#2C2A26]">${item.price} USD</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
