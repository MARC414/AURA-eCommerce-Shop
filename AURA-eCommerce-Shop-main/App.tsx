/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import Assistant from './components/Assistant';
import Footer from './components/Footer';
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

/**
 * D-018: the React shell no longer renders a seeded demo catalogue. The home
 * view is the editorial hero plus the four verified product previews, and all
 * category/product/journal navigation goes to the generated static pages
 * under /shop/, /discover/ and /journal/.
 */
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

  /** Category rooms are static pages now; leave the shell entirely. */
  const handleSelectCategory = (categorySlug: string) => {
    window.location.assign(`/shop/${categorySlug}/`);
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
    <div className="min-h-screen bg-canvas font-sans text-paper">

      {/* Navbar rendered on customer views */}
      {view.type !== 'checkout' && view.type !== 'admin' && (
        <Navbar
          cartCount={totalCartCount}
          wishlistCount={wishlistIds.length}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
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
            <FeaturedProducts />
          </>
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
              window.location.assign('/shop/');
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

      {/* Slide-out Wishlist Drawer — saved items live in this browser only */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={wishlistedProducts}
        onRemoveItem={handleRemoveWishlist}
        onAddToCart={(product, qty) => addToCart(product, qty || 1)}
        onProductClick={() => {
          setIsWishlistOpen(false);
          window.location.assign('/shop/');
        }}
        onExploreShop={() => {
          setIsWishlistOpen(false);
          window.location.assign('/shop/');
        }}
      />

      {/* Policy Modal (legacy helper; the canonical policies are static pages) */}
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
