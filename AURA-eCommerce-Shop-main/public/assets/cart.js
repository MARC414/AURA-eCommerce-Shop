/**
 * AURA's shared browser store for generated pages.
 *
 * It reads and writes exactly the keys and item shapes the React application
 * already uses:
 *   aura_cart_v1      [{ product, quantity, selectedVariant? }]
 *   aura_wishlist_v1  ["product-id", ...]
 *
 * It also keeps the pieces that have no server yet:
 *   aura_order_requests_v1  [{ reference, createdAt, items, customer }]
 *   aura_newsletter_v1      { email, savedAt }
 *
 * Browser-local only. No network call, no payment, no card data. A server will
 * replace the storage part later; the function names are the seam.
 */
(function (global) {
  'use strict';

  var CART_KEY = 'aura_cart_v1';
  var WISHLIST_KEY = 'aura_wishlist_v1';
  var ORDER_KEY = 'aura_order_requests_v1';
  var NEWSLETTER_KEY = 'aura_newsletter_v1';

  function readList(key) {
    try {
      var raw = global.localStorage.getItem(key);
      var value = raw ? JSON.parse(raw) : [];
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  }

  function writeList(key, value) {
    try {
      global.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function announce(name, detail) {
    try {
      global.dispatchEvent(new CustomEvent(name, { detail: detail }));
    } catch (error) {
      /* Very old browsers: the page still works, only the live refresh is lost. */
    }
  }

  function clamp(value, minimum, maximum) {
    var number = Math.floor(Number(value));
    if (!Number.isFinite(number)) return minimum;
    return Math.max(minimum, Math.min(maximum, number));
  }

  /** Number(null) is 0, so a missing price needs its own check. */
  function priceOf(value) {
    if (value === null || value === undefined || value === '') return NaN;
    var number = Number(value);
    return Number.isFinite(number) ? number : NaN;
  }

  function getCart() {
    return readList(CART_KEY).filter(function (item) {
      return item && item.product && item.product.id;
    }).map(function (item) {
      return {
        product: item.product,
        quantity: clamp(item.quantity, 1, 99),
        selectedVariant: item.selectedVariant
      };
    });
  }

  function saveCart(items) {
    writeList(CART_KEY, items);
    announce('aura_cart_updated', { items: items });
    return items;
  }

  function addToCart(product, quantity, variant) {
    if (!product || !product.id) return getCart();
    var items = getCart();
    var wanted = clamp(quantity, 1, 10);
    var index = -1;
    for (var position = 0; position < items.length; position += 1) {
      if (items[position].product.id === product.id && items[position].selectedVariant === variant) {
        index = position;
        break;
      }
    }
    if (index >= 0) {
      items[index].quantity = clamp(items[index].quantity + wanted, 1, 99);
    } else {
      var item = { product: product, quantity: wanted };
      if (variant) item.selectedVariant = variant;
      items.push(item);
    }
    return saveCart(items);
  }

  function updateQuantity(index, quantity) {
    var items = getCart();
    if (!items[index]) return items;
    if (quantity <= 0) {
      items.splice(index, 1);
      return saveCart(items);
    }
    items[index].quantity = clamp(quantity, 1, 99);
    return saveCart(items);
  }

  function removeAt(index) {
    var items = getCart();
    if (!items[index]) return items;
    items.splice(index, 1);
    return saveCart(items);
  }

  function clearCart() {
    return saveCart([]);
  }

  function cartCount() {
    return getCart().reduce(function (total, item) {
      return total + item.quantity;
    }, 0);
  }

  function cartSubtotal() {
    return getCart().reduce(function (total, item) {
      var price = priceOf(item.product.price);
      return total + (Number.isFinite(price) ? price * item.quantity : 0);
    }, 0);
  }

  function hasPendingPrice() {
    return getCart().some(function (item) {
      return !Number.isFinite(priceOf(item.product.price));
    });
  }

  function getWishlistIds() {
    return readList(WISHLIST_KEY).filter(function (id) {
      return typeof id === 'string' && id;
    });
  }

  function wishlistCount() {
    return getWishlistIds().length;
  }

  function isWishlisted(productId) {
    return getWishlistIds().indexOf(productId) !== -1;
  }

  function toggleWishlist(productId) {
    var ids = getWishlistIds();
    var index = ids.indexOf(productId);
    var added = index === -1;
    if (added) ids.push(productId);
    else ids.splice(index, 1);
    writeList(WISHLIST_KEY, ids);
    announce('aura_wishlist_updated', { list: ids });
    return added;
  }

  function removeFromWishlist(productId) {
    var ids = getWishlistIds().filter(function (id) { return id !== productId; });
    writeList(WISHLIST_KEY, ids);
    announce('aura_wishlist_updated', { list: ids });
    return ids;
  }

  function getOrders() {
    return readList(ORDER_KEY).filter(function (order) {
      return order && typeof order.reference === 'string' && order.reference;
    });
  }

  function saveOrder(order) {
    if (!order || !order.reference) return getOrders();
    var orders = getOrders();
    orders.unshift(order);
    writeList(ORDER_KEY, orders.slice(0, 50));
    announce('aura_order_saved', { order: order });
    return getOrders();
  }

  function removeOrder(reference) {
    var orders = getOrders().filter(function (order) {
      return order.reference !== reference;
    });
    writeList(ORDER_KEY, orders);
    announce('aura_order_saved', { order: null });
    return orders;
  }

  function getNewsletter() {
    try {
      var raw = global.localStorage.getItem(NEWSLETTER_KEY);
      var value = raw ? JSON.parse(raw) : null;
      return value && typeof value.email === 'string' ? value : null;
    } catch (error) {
      return null;
    }
  }

  function saveNewsletter(email) {
    if (!email) return null;
    var value = { email: String(email), savedAt: new Date().toISOString() };
    writeList(NEWSLETTER_KEY, value);
    announce('aura_newsletter_updated', { preference: value });
    return value;
  }

  function removeNewsletter() {
    try {
      global.localStorage.removeItem(NEWSLETTER_KEY);
    } catch (error) {
      /* Nothing to clear. */
    }
    announce('aura_newsletter_updated', { preference: null });
    return null;
  }

  global.AuraStore = {
    CART_KEY: CART_KEY,
    WISHLIST_KEY: WISHLIST_KEY,
    ORDER_KEY: ORDER_KEY,
    NEWSLETTER_KEY: NEWSLETTER_KEY,
    getCart: getCart,
    saveCart: saveCart,
    addToCart: addToCart,
    updateQuantity: updateQuantity,
    removeAt: removeAt,
    clearCart: clearCart,
    cartCount: cartCount,
    cartSubtotal: cartSubtotal,
    hasPendingPrice: hasPendingPrice,
    getWishlistIds: getWishlistIds,
    wishlistCount: wishlistCount,
    isWishlisted: isWishlisted,
    toggleWishlist: toggleWishlist,
    removeFromWishlist: removeFromWishlist,
    getOrders: getOrders,
    saveOrder: saveOrder,
    removeOrder: removeOrder,
    getNewsletter: getNewsletter,
    saveNewsletter: saveNewsletter,
    removeNewsletter: removeNewsletter
  };
})(window);
