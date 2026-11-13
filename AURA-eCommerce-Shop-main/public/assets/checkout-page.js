/**
 * Checkout: reads the shared cart, records an invoice request in this browser,
 * and shows the reference. No network call, no payment, no card fields.
 * The request shape is the seam a server will replace later.
 */
(function () {
  var form = document.querySelector('[data-checkout-form]');
  var list = document.querySelector('[data-checkout-items]');
  var empty = document.querySelector('[data-checkout-empty]');
  var summary = document.querySelector('[data-checkout-summary]');
  var subtotalOut = document.querySelector('[data-checkout-subtotal]');
  var priceNote = document.querySelector('[data-checkout-price-note]');
  var status = document.querySelector('[data-checkout-status]');
  var confirmation = document.querySelector('[data-checkout-confirmation]');
  var referenceOut = document.querySelector('[data-checkout-reference]');
  var confirmationCopy = document.querySelector('[data-checkout-confirmation-copy]');
  if (!form || !list) return;

  function setStatus(text) {
    if (status) status.textContent = text;
  }

  if (!window.AuraStore) {
    setStatus('Checkout needs JavaScript to read the cart. Nothing has been sent anywhere.');
    form.hidden = true;
    return;
  }

  function money(value, currency) {
    try {
      return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency || 'GBP' }).format(value);
    } catch (error) {
      return value.toFixed(2) + ' ' + (currency || '');
    }
  }

  /** Number(null) is 0, so a missing price needs its own check. */
  function priceOf(value) {
    if (value === null || value === undefined || value === '') return NaN;
    var number = Number(value);
    return Number.isFinite(number) ? number : NaN;
  }

  function productHref(product) {
    if (product && product.path) return product.path;
    if (product && product.slug) {
      return (product.model === 'affiliate' ? '/discover/' : '/shop/') + product.slug + '/';
    }
    return '/shop/';
  }

  function row(item) {
    var product = item.product;
    var price = priceOf(product.price);
    var priced = Number.isFinite(price);

    var element = document.createElement('li');
    element.className = 'commerce-item checkout-item';

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
    meta.textContent = [product.category, item.selectedVariant, 'Qty ' + item.quantity].filter(Boolean).join(' · ');
    copy.appendChild(meta);

    var priceLine = document.createElement('p');
    priceLine.className = 'commerce-price';
    priceLine.textContent = priced
      ? money(price, product.currency) + ' each'
      : 'Price on request';
    copy.appendChild(priceLine);

    var lineTotal = document.createElement('p');
    lineTotal.className = 'commerce-line-total';
    lineTotal.textContent = priced ? money(price * item.quantity, product.currency) : 'On invoice';
    copy.appendChild(lineTotal);

    element.appendChild(thumb);
    element.appendChild(copy);
    return element;
  }

  function render() {
    var items = window.AuraStore.getCart();
    while (list.firstChild) list.removeChild(list.firstChild);

    if (!items.length) {
      if (empty) empty.hidden = false;
      if (summary) summary.hidden = true;
      form.hidden = true;
      setStatus('Your cart is empty.');
      return;
    }

    if (empty) empty.hidden = true;
    if (summary) summary.hidden = false;
    if (!confirmation || confirmation.hidden) form.hidden = false;

    items.forEach(function (item) {
      list.appendChild(row(item));
    });

    var pending = window.AuraStore.hasPendingPrice();
    if (subtotalOut) {
      subtotalOut.textContent = pending
        ? 'On invoice'
        : money(window.AuraStore.cartSubtotal(), items[0].product.currency);
    }
    if (priceNote) priceNote.hidden = !pending;
    var count = window.AuraStore.cartCount();
    setStatus(count + (count === 1 ? ' piece ready for your invoice request.' : ' pieces ready for your invoice request.'));
  }

  function reference() {
    var now = new Date();
    var date = [
      String(now.getFullYear()).slice(2),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0')
    ].join('');
    var random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return 'OPAR-' + date + '-' + random;
  }

  function snapshot(items) {
    return items.map(function (item) {
      var product = item.product;
      var price = priceOf(product.price);
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        model: product.model || 'dropshipping',
        path: productHref(product),
        category: product.category,
        price: Number.isFinite(price) ? price : null,
        currency: product.currency || 'GBP',
        imageUrl: product.imageUrl,
        quantity: item.quantity,
        selectedVariant: item.selectedVariant || null
      };
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var items = window.AuraStore.getCart();
    if (!items.length) {
      setStatus('Your cart is empty.');
      render();
      return;
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus('Check the required fields before sending the request.');
      return;
    }

    var data = new window.FormData(form);
    var value = function (key) {
      return String(data.get(key) || '').trim();
    };
    var referenceCode = reference();
    var order = {
      reference: referenceCode,
      createdAt: new Date().toISOString(),
      status: 'invoice-requested',
      currency: items[0].product.currency || 'GBP',
      subtotal: window.AuraStore.hasPendingPrice() ? null : window.AuraStore.cartSubtotal(),
      priceOnRequest: window.AuraStore.hasPendingPrice(),
      items: snapshot(items),
      customer: {
        name: value('name'),
        email: value('email'),
        country: value('country'),
        city: value('city'),
        address: value('address'),
        postcode: value('postcode'),
        phone: value('phone'),
        notes: value('notes')
      }
    };

    window.AuraStore.saveOrder(order);
    window.AuraStore.clearCart();

    if (referenceOut) referenceOut.textContent = referenceCode;
    if (confirmationCopy) {
      confirmationCopy.textContent = 'Your request is saved in this browser. OPAR replies to ' +
        (order.customer.email || 'the address you gave') +
        ' with the price, delivery and payment method before anything is paid.';
    }
    form.hidden = true;
    if (summary) summary.hidden = true;
    if (empty) empty.hidden = true;
    if (confirmation) {
      confirmation.hidden = false;
      confirmation.focus();
    }
    setStatus('Request recorded. Reference ' + referenceCode + '.');
  });

  window.addEventListener('aura_cart_updated', render);
  window.addEventListener('storage', function (event) {
    if (event.key === window.AuraStore.CART_KEY) render();
  });

  render();
})();
