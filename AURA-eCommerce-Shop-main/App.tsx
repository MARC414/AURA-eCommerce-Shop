/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import PilotProducts from './components/PilotProducts';
import About from './components/About';
import Journal from './components/Journal';
import Assistant from './components/Assistant';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import JournalDetail from './components/JournalDetail';
import CategoryPage from './components/CategoryPage';
import WishlistDrawer from './components/WishlistDrawer';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSuccess';
import AdminDashboard from './components/AdminDashboard';
import PolicyModal from './components/PolicyModal';
import { AuthenticSourcesModal } from './components/AuthenticSourcesModal';
import { Product, ViewState, CartItem, Order, LegalPolicyType } from './types';
import { storeService } from './services/storeService';
import { commerce } from './services/commerce';

function App() {
  const [view, setView] = useState<ViewState>({ type: 'home' });
  const [cartItems, setCartItems] = useState<CartItem[]>(() => commerce.getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>(storeService.getWishlist());
  const [activePolicy, setActivePolicy] = useState<LegalPolicyType | null>(null);
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);

  // Sync wishlist updates across components
  useEffect(() => {
    const handleWishlistUpdate = () => {
      setWishlistIds(storeService.getWishlist());
    };
    window.addEventListener('aura_wishlist_updated', handleWishlistUpdate);
    return () => window.removeEventListener('aura_wishlist_updated', handleWishlistUpdate);
  }, []);

  const handleToggleWishlist = (productId: string) => {
    storeService.toggleWishlist(productId);
    setWishlistIds(storeService.getWishlist());
  };

  const handleRemoveWishlist = (productId: string) => {
    storeService.removeFromWishlist(productId);
    setWishlistIds(storeService.getWishlist());
  };

  // Scroll or navigate between sections
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    
    if (view.type !== 'home') {
      setView({ type: 'home' });
      setTimeout(() => scrollToSection(targetId), 50);
    } else {
      scrollToSection(targetId);
    }
  };

  const scrollToSection = (targetId: string) => {
    if (!targetId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      try {
        window.history.pushState(null, '', `#${targetId}`);
      } catch (err) {
        // Ignore in restricted sandboxes
      }
    }
  };

  const handleSelectCategory = (categorySlug: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView({ type: 'category', categorySlug });
  };

  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    setCartItems(previous => commerce.addToCart(previous, product, quantity, variant));
    setIsCartOpen(true);
  };

  const updateCartQuantity = (index: number, newQty: number) => {
    setCartItems(previous => commerce.updateQuantity(previous, index, newQty));
  };

  const removeFromCart = (index: number) => {
    setCartItems(previous => commerce.removeAt(previous, index));
  };

  const handleOrderComplete = (order: Order) => {
    setCartItems(commerce.clearCart());
    setIsCartOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView({ type: 'order_success', order });
  };

  const allProducts = storeService.getProducts();
  const wishlistedProducts = allProducts.filter(p => wishlistIds.includes(p.id));
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F5F2EB] font-sans text-[#2C2A26] selection:bg-[#D6D1C7] selection:text-[#2C2A26]">
      
      {/* Navbar rendered on customer views */}
      {view.type !== 'checkout' && view.type !== 'admin' && (
        <Navbar 
          onNavClick={handleNavClick} 
          cartCount={totalCartCount}
          wishlistCount={wishlistIds.length}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onSelectCategory={handleSelectCategory}
          onOpenSources={() => setIsSourcesModalOpen(true)}
          onOpenAdmin={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setView({ type: 'admin' });
          }}
        />
      )}
      
      <main>
        {view.type === 'home' && (
          <>
            <Hero />
            <PilotProducts />
            <ProductGrid 
              initialCategory={view.initialCategory || 'All'}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onSelectCategory={handleSelectCategory}
              onProductClick={(p) => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setView({ type: 'product', product: p });
              }} 
            />
            <About />
            <Journal onArticleClick={(a) => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'journal', article: a });
            }} />
          </>
        )}

        {view.type === 'category' && (
          <CategoryPage 
            categorySlug={view.categorySlug}
            products={allProducts}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onProductClick={(p) => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'product', product: p });
            }}
            onBackToHome={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'home' });
            }}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {view.type === 'product' && (
          <ProductDetail 
            product={view.product} 
            isWishlisted={wishlistIds.includes(view.product.id)}
            onToggleWishlist={handleToggleWishlist}
            onBack={() => {
              setView({ type: 'home' });
              setTimeout(() => scrollToSection('products'), 50);
            }}
            onAddToCart={addToCart}
            onProductClick={(p) => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'product', product: p });
            }}
          />
        )}

        {view.type === 'journal' && (
          <JournalDetail 
            article={view.article} 
            onBack={() => setView({ type: 'home' })}
          />
        )}

        {view.type === 'checkout' && (
          <Checkout 
            items={cartItems}
            onBack={() => setView({ type: 'home' })}
            onOrderComplete={handleOrderComplete}
          />
        )}

        {view.type === 'order_success' && (
          <OrderSuccess 
            order={view.order}
            onContinueShopping={() => {
              setView({ type: 'home' });
              setTimeout(() => scrollToSection('products'), 50);
            }}
            onOpenAdmin={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'admin' });
            }}
          />
        )}

        {view.type === 'admin' && (
          <AdminDashboard 
            onBackToShop={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'home' });
            }}
          />
        )}
      </main>

      {/* Footer rendered on storefront views */}
      {view.type !== 'checkout' && view.type !== 'admin' && (
        <Footer 
          onLinkClick={handleNavClick} 
          onOpenPolicy={(policy) => setActivePolicy(policy)}
          onOpenSources={() => setIsSourcesModalOpen(true)}
          onSelectCategory={handleSelectCategory}
          onOpenAdmin={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setView({ type: 'admin' });
          }}
        />
      )}
      
      {/* AI Concierge Assistant (Always available on storefront) */}
      {view.type !== 'admin' && <Assistant />}
      
      {/* Slide-out Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setView({ type: 'checkout' });
        }}
      />

      {/* Slide-out Wishlist Drawer */}
      <WishlistDrawer 
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={wishlistedProducts}
        onRemoveItem={handleRemoveWishlist}
        onAddToCart={(product, qty) => addToCart(product, qty || 1)}
        onProductClick={(product) => {
          setIsWishlistOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setView({ type: 'product', product });
        }}
        onExploreShop={() => {
          setIsWishlistOpen(false);
          if (view.type !== 'home') setView({ type: 'home' });
          setTimeout(() => scrollToSection('products'), 50);
        }}
      />

      {/* Policy Modal */}
      <PolicyModal 
        policy={activePolicy} 
        onClose={() => setActivePolicy(null)} 
      />

      {/* Authentic Sources & Lineage Guide Modal */}
      <AuthenticSourcesModal 
        isOpen={isSourcesModalOpen}
        onClose={() => setIsSourcesModalOpen(false)}
      />
    </div>
  );
}

export default App;
