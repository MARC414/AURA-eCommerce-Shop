/**
 * Progressive enhancement only: gallery, quantity, cart and wishlist controls,
 * and image fallbacks. Storage lives in cart.js; no network or payment call.
 */
function attachImageFallback(image) {
  const fallback = () => {
    const replacement = image.dataset.fallback;
    if (!replacement || image.getAttribute('src') === replacement) return;
    image.src = replacement;
    if (image.hasAttribute('data-main-image')) {
      image.alt = 'Supplier image unavailable; showing a photography placeholder';
      const caption = image.closest('[data-gallery]')?.querySelector('p[data-gallery-caption]');
      if (caption) caption.textContent = 'The supplier image could not be loaded. This is a placeholder, not the product photograph.';
    }
  };
  image.addEventListener('error', fallback);
  if (image.complete && image.naturalWidth === 0) fallback();
}

document.querySelectorAll('img[data-fallback]').forEach(attachImageFallback);

document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const image = gallery.querySelector('[data-main-image]');
  const caption = gallery.querySelector('p[data-gallery-caption]');
  const buttons = gallery.querySelectorAll('[data-gallery-src]');

  buttons.forEach(button => button.addEventListener('click', () => {
    image.alt = button.dataset.galleryAlt;
    image.src = button.dataset.gallerySrc;
    caption.textContent = button.dataset.galleryCaption;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
});

/** The cart item must match services/commerce.ts: { product, quantity, selectedVariant? }. */
function cartProduct(button) {
  const price = button.dataset.productPrice === '' ? null : Number(button.dataset.productPrice);
  return {
    id: button.dataset.productId,
    name: button.dataset.productName,
    slug: button.dataset.productSlug,
    tagline: button.dataset.productTagline,
    description: button.dataset.productTagline,
    price: Number.isFinite(price) ? price : null,
    currency: button.dataset.productCurrency || 'GBP',
    category: button.dataset.productCategory,
    model: button.dataset.productModel || 'dropshipping',
    path: button.dataset.productPath || '',
    imageUrl: button.dataset.productImage,
    gallery: button.dataset.productImage ? [button.dataset.productImage] : []
  };
}

document.querySelectorAll('[data-wishlist-toggle]').forEach(button => {
  const productId = button.dataset.wishlistToggle;
  const label = button.querySelector('[data-wishlist-label]');
  const sync = () => {
    const saved = Boolean(window.AuraStore) && window.AuraStore.isWishlisted(productId);
    button.setAttribute('aria-pressed', String(saved));
    button.classList.toggle('is-saved', saved);
    if (label) label.textContent = saved ? 'Saved to wishlist' : 'Save to wishlist';
  };
  sync();
  button.addEventListener('click', () => {
    if (!window.AuraStore) return;
    window.AuraStore.toggleWishlist(productId);
    sync();
  });
});

document.querySelectorAll('[data-product-model="dropshipping"]').forEach(product => {
  const quantityOutput = product.querySelector('[data-quantity]');
  const status = product.querySelector('[data-selection-status]');
  const variant = product.querySelector('[data-variant]');
  const cartButton = product.querySelector('[data-add-to-cart]');
  const buttons = product.querySelectorAll('[data-quantity-change]');
  let quantity = 1;

  const chosenVariant = () => (variant && !variant.disabled && variant.value ? variant.value : undefined);

  const update = () => {
    quantityOutput.textContent = String(quantity);
    buttons.forEach(button => {
      const change = Number(button.dataset.quantityChange);
      button.disabled = (change < 0 && quantity === 1) || (change > 0 && quantity === 10);
    });
    const selected = chosenVariant();
    status.textContent = `${quantity} selected${selected ? ` · ${selected}` : ''}.`;
  };

  buttons.forEach(button => button.addEventListener('click', () => {
    quantity = Math.max(1, Math.min(10, quantity + Number(button.dataset.quantityChange)));
    update();
  }));
  variant?.addEventListener('change', update);

  if (cartButton) {
    if (!window.AuraStore) {
      cartButton.disabled = true;
      cartButton.textContent = 'Cart unavailable — JavaScript is off';
    } else {
      cartButton.addEventListener('click', () => {
        const snapshot = cartProduct(cartButton);
        window.AuraStore.addToCart(snapshot, quantity, chosenVariant());
        update();
        status.textContent = `Added ${quantity} × ${snapshot.name} to the cart.`;
        cartButton.classList.add('is-confirmed');
        window.setTimeout(() => cartButton.classList.remove('is-confirmed'), 1200);
      });
    }
  }

  update();
});
