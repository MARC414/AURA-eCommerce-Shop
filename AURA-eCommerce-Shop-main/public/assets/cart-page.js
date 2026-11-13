/**
 * Cart page. Reads the shared store (cart.js) and renders it. No checkout,
 * no payment, no network call. All text is set with textContent.
 */
(function () {
  var list = document.querySelector('[data-cart-items]');
  var empty = document.querySelector('[data-cart-empty]');
  var summary = document.querySelector('[data-cart-summary]');
  var status = document.querySelector('[data-cart-status]');
  var subtotalOut = document.querySelector('[data-cart-subtotal]');
  var note = document.querySelector('[data-cart-price-note]');
  if (!list) return;

  if (!window.AuraStore) {
    if (status) status.textContent = 'The cart needs JavaScript. Nothing has been sent anywhere.';
    return;
  }

  function money(value, currency) {
    try {
      return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency || 'GBP' }).format(value);
    } catch (error) {
      return value.toFixed(2) + ' ' + (currency || '');
    }
  }

  function productHref(product) {
    if (product && product.path) return product.path;
    if (product && product.slug) {
      return (product.model === 'affiliate' ? '/discover/' : '/shop/') + product.slug + '/';
    }
    return '/shop/';
  }

  /** Number(null) is 0, so a missing price needs its own check. */
  function priceOf(value) {
    if (value === null || value === undefined || value === '') return NaN;
    var number = Number(value);
    return Number.isFinite(number) ? number : NaN;
  }

  function control(label, text, attribute, index, disabled) {
    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.setAttribute(attribute, String(index));
    button.setAttribute('aria-label', label);
    if (disabled) button.disabled = true;
    return button;
  }

  function render() {
    var items = window.AuraStore.getCart();
    while (list.firstChild) list.removeChild(list.firstChild);

    if (!items.length) {
      if (empty) empty.hidden = false;
      if (summary) summary.hidden = true;
      if (status) status.textContent = 'Your cart is empty.';
      return;
    }

    if (empty) empty.hidden = true;
    if (summary) summary.hidden = false;

    items.forEach(function (item, index) {
      var product = item.product;
      var price = priceOf(product.price);
      var priced = Number.isFinite(price);

      var row = document.createElement('li');
      row.className = 'commerce-item';

      var thumb = document.createElement('a');
      thumb.className = 'commerce-thumb';
      thumb.href = productHref(product);
      thumb.tabIndex = -1;
      thumb.setAttribute('aria-hidden', 'true');
      var image = document.createElement('img');
      image.src = product.imageUrl || '/assets/products/photography-pending.svg';
      image.alt = '';
      image.width = 96;
      image.height = 120;
      image.loading = 'lazy';
      thumb.appendChild(image);

      var copy = document.createElement('div');
      copy.className = 'commerce-copy';

      var name = document.createElement('a');
      name.className = 'commerce-name';
      name.href = productHref(product);
      name.textContent = product.name || 'Item';
      copy.appendChild(name);

      var meta = document.createElement('p');
      meta.className = 'commerce-meta';
      meta.textContent = [product.category, item.selectedVariant].filter(Boolean).join(' · ');
      if (meta.textContent) copy.appendChild(meta);

      var priceLine = document.createElement('p');
      priceLine.className = 'commerce-price';
      priceLine.textContent = priced
        ? money(price, product.currency) + ' each'
        : 'Price on request';
      copy.appendChild(priceLine);

      var quantity = document.createElement('div');
      quantity.className = 'quantity-control';
      quantity.setAttribute('role', 'group');
      quantity.setAttribute('aria-label', 'Quantity for ' + (product.name || 'this item'));
      quantity.appendChild(control('Decrease quantity', '−', 'data-cart-decrease', index, item.quantity <= 1));

      var output = document.createElement('output');
      output.textContent = String(item.quantity);
      output.setAttribute('aria-label', 'Selected quantity');
      quantity.appendChild(output);

      quantity.appendChild(control('Increase quantity', '+', 'data-cart-increase', index, item.quantity >= 99));
      copy.appendChild(quantity);

      var lineTotal = document.createElement('p');
      lineTotal.className = 'commerce-line-total';
      lineTotal.textContent = priced ? money(price * item.quantity, product.currency) : '—';
      copy.appendChild(lineTotal);

      var remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'commerce-remove';
      remove.textContent = 'Remove';
      remove.setAttribute('data-cart-remove', String(index));
      remove.setAttribute('aria-label', 'Remove ' + (product.name || 'this item') + ' from the cart');

      row.appendChild(thumb);
      row.appendChild(copy);
      row.appendChild(remove);
      list.appendChild(row);
    });

    var pending = window.AuraStore.hasPendingPrice();
    if (subtotalOut) {
      subtotalOut.textContent = pending ? 'On invoice' : money(window.AuraStore.cartSubtotal(), items[0].product.currency);
    }
    if (note) note.hidden = !pending;
    var count = window.AuraStore.cartCount();
    if (status) status.textContent = count + (count === 1 ? ' item in the cart.' : ' items in the cart.');
  }

  list.addEventListener('click', function (event) {
    var button = event.target.closest('button[data-cart-decrease], button[data-cart-increase], button[data-cart-remove]');
    if (!button) return;
    var index = Number(
      button.getAttribute('data-cart-decrease') ??
      button.getAttribute('data-cart-increase') ??
      button.getAttribute('data-cart-remove')
    );
    var items = window.AuraStore.getCart();
    if (!items[index]) return;
    if (button.hasAttribute('data-cart-remove')) {
      window.AuraStore.removeAt(index);
    } else if (button.hasAttribute('data-cart-increase')) {
      window.AuraStore.updateQuantity(index, items[index].quantity + 1);
    } else {
      window.AuraStore.updateQuantity(index, items[index].quantity - 1);
    }
  });

  window.addEventListener('aura_cart_updated', render);
  window.addEventListener('storage', function (event) {
    if (event.key === window.AuraStore.CART_KEY) render();
  });

  render();
})();
