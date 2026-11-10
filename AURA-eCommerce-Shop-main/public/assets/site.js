/**
 * Shared chrome behaviour only: one navigation panel open at a time, Escape to
 * close, the mobile section menu, and live cart and wishlist counts. No orders,
 * no network calls, no tracking. Counts come from cart.js; the fallback only
 * reads storage.
 */
(function () {
  var groups = Array.prototype.slice.call(document.querySelectorAll('.nav-group'));
  /* The mobile section menu (T4.5). It is a <details> of its own, so it opens
     without this file; what it needs is Escape and a click elsewhere to close,
     with focus going back to the icon that opened it. */
  var menu = document.querySelector('.nav-toggle');

  groups.forEach(function (group) {
    group.addEventListener('toggle', function () {
      if (!group.open) return;
      groups.forEach(function (other) {
        if (other !== group) other.open = false;
      });
    });
  });

  function closeMenu() {
    if (!menu || !menu.open) return false;
    menu.open = false;
    var summary = menu.querySelector('summary');
    if (summary) summary.focus();
    return true;
  }

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var open = document.querySelector('.nav-group[open]');
    if (open) {
      open.open = false;
      var summary = open.querySelector('summary');
      if (summary) summary.focus();
      return;
    }
    closeMenu();
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.nav-group')) {
      groups.forEach(function (group) { group.open = false; });
    }
    if (menu && menu.open && !event.target.closest('.header-row')) closeMenu();
  });

  function setCount(selector, count, singular, plural) {
    var badge = document.querySelector(selector);
    if (!badge) return;
    if (!Number.isFinite(count) || count <= 0) {
      badge.textContent = '';
      badge.hidden = true;
      badge.removeAttribute('aria-label');
      return;
    }
    badge.textContent = String(count);
    badge.hidden = false;
    badge.setAttribute('aria-label', count + ' ' + (count === 1 ? singular : plural));
  }

  function readCount(key, map) {
    try {
      var raw = window.localStorage.getItem(key);
      var value = raw ? JSON.parse(raw) : [];
      return Array.isArray(value) ? value.reduce(map, 0) : 0;
    } catch (error) {
      return 0;
    }
  }

  function refresh() {
    if (window.AuraStore) {
      setCount('[data-cart-count]', window.AuraStore.cartCount(), 'item in cart', 'items in cart');
      setCount('[data-wishlist-count]', window.AuraStore.wishlistCount(), 'item in wishlist', 'items in wishlist');
      return;
    }
    setCount('[data-cart-count]', readCount('aura_cart_v1', function (total, item) {
      var quantity = Number(item && item.quantity);
      return total + (Number.isFinite(quantity) && quantity > 0 ? quantity : 0);
    }), 'item in cart', 'items in cart');
    setCount('[data-wishlist-count]', readCount('aura_wishlist_v1', function (total, id) {
      return total + (typeof id === 'string' && id ? 1 : 0);
    }), 'item in wishlist', 'items in wishlist');
  }

  refresh();
  window.addEventListener('aura_cart_updated', refresh);
  window.addEventListener('aura_wishlist_updated', refresh);
  window.addEventListener('storage', function (event) {
    if (!event.key || event.key === 'aura_cart_v1' || event.key === 'aura_wishlist_v1') refresh();
  });
})();
