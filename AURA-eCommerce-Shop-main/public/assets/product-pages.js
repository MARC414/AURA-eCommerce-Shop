/** Progressive enhancement only: gallery, preview quantity, and image fallbacks. */
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

document.querySelectorAll('[data-product-model="dropshipping"]').forEach(product => {
  const quantityOutput = product.querySelector('[data-quantity]');
  const status = product.querySelector('[data-selection-status]');
  const variant = product.querySelector('[data-variant]');
  const buttons = product.querySelectorAll('[data-quantity-change]');
  let quantity = 1;

  const update = () => {
    quantityOutput.textContent = String(quantity);
    buttons.forEach(button => {
      const change = Number(button.dataset.quantityChange);
      button.disabled = (change < 0 && quantity === 1) || (change > 0 && quantity === 10);
    });
    const selectedVariant = variant && !variant.disabled ? ` · ${variant.value}` : '';
    status.textContent = `Preview quantity: ${quantity}${selectedVariant}. Ordering remains closed.`;
  };

  buttons.forEach(button => button.addEventListener('click', () => {
    quantity = Math.max(1, Math.min(10, quantity + Number(button.dataset.quantityChange)));
    update();
  }));
  variant?.addEventListener('change', update);
  update();
});
