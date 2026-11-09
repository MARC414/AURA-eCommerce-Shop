/**
 * Wishlist page. Reads saved product IDs from the shared store (cart.js) and
 * joins them to a static catalogue of the products that exist on this site.
 *
 * No account, no server, no network call to AURA: catalogue.json is a file
 * served with the site. A removed product is shown honestly rather than hidden.
 */
(function () {
  var list = document.querySelector('[data-wishlist-items]');
  var empty = document.querySelector('[data-wishlist-empty]');
  var status = document.querySelector('[data-wishlist-status]');
  if (!list) return;

  if (!window.AuraStore) {
    if (status) status.textContent = 'The wishlist needs JavaScript. Nothing has been sent anywhere.';
    return;
  }

  var catalogue = null;
  var failed = false;

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

  function findEntry(id) {
    if (!catalogue) return null;
    for (var index = 0; index < catalogue.length; index += 1) {
      if (catalogue[index].id === id) return catalogue[index];
    }
    return null;
  }

  function removeButton(id, name) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'commerce-remove';
    button.textContent = 'Remove';
    button.setAttribute('data-wishlist-remove', id);
    button.setAttribute('aria-label', 'Remove ' + (name || 'this item') + ' from the wishlist');
    return button;
  }

  function render() {
    var ids = window.AuraStore.getWishlistIds();
    while (list.firstChild) list.removeChild(list.firstChild);

    if (!ids.length) {
      if (empty) empty.hidden = false;
      list.hidden = true;
      if (status) status.textContent = 'Your wishlist is empty.';
      return;
    }

    if (empty) empty.hidden = true;
    list.hidden = false;

    ids.forEach(function (id) {
      var entry = findEntry(id);
      var row = document.createElement('li');
      row.className = 'commerce-item';

      var thumb = document.createElement('span');
      thumb.className = 'commerce-thumb';
      thumb.setAttribute('aria-hidden', 'true');
      var image = document.createElement('img');
      image.src = (entry && entry.imageUrl) || '/assets/products/photography-pending.svg';
      image.alt = '';
      image.width = 96;
      image.height = 120;
      image.loading = 'lazy';
      thumb.appendChild(image);
      row.appendChild(thumb);

      var copy = document.createElement('div');
      copy.className = 'commerce-copy';

      var name;
      if (entry) {
        name = document.createElement('a');
        name.className = 'commerce-name';
        name.href = entry.path;
        name.textContent = entry.name;
      } else {
        name = document.createElement('span');
        name.className = 'commerce-name';
        name.textContent = failed ? 'Saved item' : 'No longer listed on this site';
      }
      copy.appendChild(name);

      var meta = document.createElement('p');
      meta.className = 'commerce-meta';
      meta.textContent = entry
        ? [entry.category, entry.model === 'affiliate' ? 'Partner offer · external checkout' : 'Sold by OPAR'].filter(Boolean).join(' · ')
        : id;
      copy.appendChild(meta);

      var price = document.createElement('p');
      price.className = 'commerce-price';
      if (entry && Number.isFinite(priceOf(entry.price))) {
        price.textContent = money(priceOf(entry.price), entry.currency);
      } else if (entry) {
        price.textContent = 'Price on request';
      } else {
        price.textContent = '';
      }
      if (price.textContent) copy.appendChild(price);

      row.appendChild(copy);
      row.appendChild(removeButton(id, entry && entry.name));
      list.appendChild(row);
    });

    var count = ids.length;
    if (status) status.textContent = count + (count === 1 ? ' saved item.' : ' saved items.');
  }

  list.addEventListener('click', function (event) {
    var button = event.target.closest('button[data-wishlist-remove]');
    if (!button) return;
    window.AuraStore.removeFromWishlist(button.getAttribute('data-wishlist-remove'));
  });

  window.addEventListener('aura_wishlist_updated', render);
  window.addEventListener('storage', function (event) {
    if (event.key === window.AuraStore.WISHLIST_KEY) render();
  });

  if (typeof window.fetch !== 'function') {
    failed = true;
    render();
    return;
  }

  window.fetch('/assets/catalogue.json', { credentials: 'same-origin' })
    .then(function (response) {
      if (!response.ok) throw new Error('Catalogue unavailable');
      return response.json();
    })
    .then(function (data) {
      catalogue = Array.isArray(data) ? data : [];
      render();
    })
    .catch(function () {
      failed = true;
      render();
    });
})();
