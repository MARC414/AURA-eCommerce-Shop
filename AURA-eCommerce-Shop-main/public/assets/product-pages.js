/**
 * Progressive enhancement only: gallery, quantity, cart and wishlist controls,
 * and image fallbacks. Storage lives in cart.js; no network or payment call.
 */
function attachImageFallback(image) {
  const fallback = () => {
    if (image.dataset.fallbackEmpty === 'true') {
      const mount = image.closest('[data-main-mount], .product-mount');
      if (!mount) return;
      const picture = mount.querySelector('picture');
      if (picture) picture.hidden = true;
      image.hidden = true;
      const emptyMount = mount.querySelector('[data-empty-mount]');
      if (emptyMount) emptyMount.hidden = false;
      if (image.hasAttribute('data-main-image')) {
        const caption = image.closest('[data-gallery]')?.querySelector('p[data-gallery-caption]');
        if (caption) caption.textContent = 'Photograph in preparation — image unavailable.';
      }
      return;
    }
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
  if (!image.hidden && image.complete && image.naturalWidth === 0) fallback();
}

document.querySelectorAll('img[data-fallback], img[data-fallback-empty="true"]').forEach(attachImageFallback);

document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const mount = gallery.querySelector('[data-main-mount]') || gallery.querySelector('.main-image');
  const picture = mount?.querySelector('picture');
  const image = gallery.querySelector('[data-main-image]');
  const emptyMount = gallery.querySelector('[data-empty-mount]');
  const caption = gallery.querySelector('p[data-gallery-caption]');
  const buttons = gallery.querySelectorAll('[data-gallery-src]');
  const initialImgSrc = image ? image.getAttribute('src') : '';
  const initialSources = picture
    ? [...picture.querySelectorAll('source')].map(source => ({ el: source, srcset: source.getAttribute('srcset') || '' }))
    : [];

  buttons.forEach(button => button.addEventListener('click', () => {
    const isEmpty = button.dataset.galleryEmpty === 'true';
    if (caption) caption.textContent = button.dataset.galleryCaption || '';
    if (emptyMount) emptyMount.hidden = !isEmpty;

    if (isEmpty) {
      if (picture) picture.hidden = true;
      if (image) image.hidden = true;
    } else {
      if (picture) {
        picture.hidden = false;
        const restoreOriginal = button.dataset.gallerySrc === initialImgSrc;
        initialSources.forEach(({ el, srcset }) => {
          if (restoreOriginal && srcset) el.setAttribute('srcset', srcset);
          else el.removeAttribute('srcset');
        });
      }
      if (image) {
        image.hidden = false;
        image.alt = button.dataset.galleryAlt || '';
        image.src = button.dataset.gallerySrc;
      }
    }

    if (mount) {
      if (button.dataset.galleryBlend === 'none') mount.setAttribute('data-blend', 'none');
      else mount.removeAttribute('data-blend');
    }
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

function formatCurrency(amount, currency) {
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency || 'GBP' }).format(amount);
  } catch {
    return `${Number(amount).toFixed(2)} ${currency || ''}`.trim();
  }
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

document.querySelectorAll('.product-layout[data-product-model="dropshipping"]').forEach(product => {
  const quantityOutput = product.querySelector('[data-quantity]');
  const status = product.querySelector('[data-selection-status]');
  if (!quantityOutput || !status) return;
  const variant = product.querySelector('[data-variant]');
  const cartButton = product.querySelector('[data-add-to-cart]');
  const priceOut = product.querySelector('[data-price-value]');
  const buttons = product.querySelectorAll('[data-quantity-change]');
  const basePrice = cartButton ? cartButton.dataset.productPrice : '';
  const currency = cartButton ? (cartButton.dataset.productCurrency || 'GBP') : 'GBP';
  let quantity = 1;

  const chosenVariant = () => (variant && !variant.disabled && variant.value ? variant.value : undefined);

  const syncPrice = () => {
    const selectedOption = variant && !variant.disabled && variant.selectedIndex >= 0
      ? variant.options[variant.selectedIndex]
      : null;
    const variantPrice = selectedOption?.dataset.variantPrice;
    const rawPrice = variantPrice !== undefined && variantPrice !== '' ? variantPrice : basePrice;
    if (cartButton) cartButton.dataset.productPrice = rawPrice;
    if (!priceOut) return;
    if (rawPrice !== '' && Number.isFinite(Number(rawPrice))) {
      priceOut.textContent = '';
      priceOut.appendChild(document.createTextNode(`${formatCurrency(Number(rawPrice), currency)} `));
      const code = document.createElement('span');
      code.className = 'currency';
      code.textContent = currency;
      priceOut.appendChild(code);
      priceOut.classList.remove('price-request');
    } else {
      priceOut.textContent = 'Price on request';
      priceOut.classList.add('price-request');
    }
  };

  const update = () => {
    quantityOutput.textContent = String(quantity);
    buttons.forEach(button => {
      const change = Number(button.dataset.quantityChange);
      button.disabled = (change < 0 && quantity === 1) || (change > 0 && quantity === 10);
    });
    syncPrice();
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
        syncPrice();
        const snapshot = cartProduct(cartButton);
        window.AuraStore.addToCart(snapshot, quantity, chosenVariant());
        update();
        status.textContent = `Added ${quantity} × ${snapshot.name} to the cart.`;
        const bagBridge = product.querySelector('[data-v2-bag-bridge]');
        if (bagBridge) bagBridge.hidden = false;
        cartButton.classList.add('is-confirmed');
        window.setTimeout(() => cartButton.classList.remove('is-confirmed'), 1200);
      });
    }
  }

  update();
});
