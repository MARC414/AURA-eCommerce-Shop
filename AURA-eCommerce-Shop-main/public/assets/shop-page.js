/**
 * Client-side Shop hub filter, sort, and URL state controller.
 * Keeps all cards visible in static HTML for no-JS fallback, then applies
 * instant single-page filtering, sorting, empty-state recovery, and mobile
 * disclosure syncing across the editorial left sidebar.
 */
(function () {
  var form = document.querySelector('[data-shop-form]');
  var grid = document.querySelector('[data-shop-grid]');
  if (!form || !grid) return;

  var cards = Array.from(grid.querySelectorAll('.product-card'));
  var totalCount = cards.length;
  var countEl = document.querySelector('[data-shop-count]');
  var emptyEl = document.querySelector('[data-shop-empty]');
  var summaryEl = document.querySelector('[data-shop-active-summary]');
  var disclosureEl = document.querySelector('[data-shop-disclosure]');
  var resetButtons = Array.from(document.querySelectorAll('[data-shop-reset]'));
  var roomStripEl = document.querySelector('[data-shop-room-strip]');
  var roomDataEl = document.querySelector('[data-shop-rooms-data]');
  var roomMap = {};
  if (roomDataEl && roomDataEl.textContent) {
    try {
      roomMap = JSON.parse(roomDataEl.textContent);
    } catch (e) {
      roomMap = {};
    }
  }
  var roomAvifEl = roomStripEl ? roomStripEl.querySelector('[data-room-avif]') : null;
  var roomWebpEl = roomStripEl ? roomStripEl.querySelector('[data-room-webp]') : null;
  var roomImgEl = roomStripEl ? roomStripEl.querySelector('[data-room-img]') : null;
  var roomEyebrowEl = roomStripEl ? roomStripEl.querySelector('[data-room-eyebrow]') : null;
  var roomHeadingEl = roomStripEl ? roomStripEl.querySelector('[data-room-heading]') : null;
  var roomIntroEl = roomStripEl ? roomStripEl.querySelector('[data-room-intro]') : null;
  var roomLinkEl = roomStripEl ? roomStripEl.querySelector('[data-room-link]') : null;

  var defaults = {
    room: 'all',
    status: 'all',
    tier: 'all',
    sort: 'curated'
  };

  function priceOf(card) {
    var raw = card.dataset.price;
    if (raw === undefined || raw === '') return NaN;
    var num = Number(raw);
    return Number.isFinite(num) ? num : NaN;
  }

  function currentState() {
    var data = new FormData(form);
    return {
      room: String(data.get('room') || defaults.room),
      status: String(data.get('status') || defaults.status),
      tier: String(data.get('tier') || defaults.tier),
      sort: String(data.get('sort') || defaults.sort)
    };
  }

  function applyQueryToForm() {
    var params = new URLSearchParams(window.location.search);
    ['room', 'status', 'tier'].forEach(function (name) {
      var val = params.get(name);
      if (!val) return;
      var input = form.querySelector('input[name="' + name + '"][value="' + CSS.escape(val) + '"]');
      if (input) input.checked = true;
    });
    var sortVal = params.get('sort');
    var sortSelect = form.querySelector('select[name="sort"]');
    if (sortVal && sortSelect && sortSelect.querySelector('option[value="' + CSS.escape(sortVal) + '"]')) {
      sortSelect.value = sortVal;
    }
  }

  function syncUrl(state) {
    if (!window.history || typeof window.history.replaceState !== 'function') return;
    var params = new URLSearchParams();
    if (state.room !== defaults.room) params.set('room', state.room);
    if (state.status !== defaults.status) params.set('status', state.status);
    if (state.tier !== defaults.tier) params.set('tier', state.tier);
    if (state.sort !== defaults.sort) params.set('sort', state.sort);
    var query = params.toString();
    var nextUrl = window.location.pathname + (query ? '?' + query : '') + window.location.hash;
    window.history.replaceState(null, '', nextUrl);
  }

  function matchesTier(price, tier) {
    if (tier === 'all') return true;
    if (tier === 'request') return !Number.isFinite(price);
    if (!Number.isFinite(price)) return false;
    if (tier === 'under-20') return price < 20;
    if (tier === '20-45') return price >= 20 && price <= 45;
    if (tier === '45-plus') return price > 45;
    return true;
  }

  function hasActiveFilter(state) {
    return state.room !== defaults.room ||
      state.status !== defaults.status ||
      state.tier !== defaults.tier ||
      state.sort !== defaults.sort;
  }

  function labelForChecked(name, fallback) {
    var checked = form.querySelector('input[name="' + name + '"]:checked');
    if (!checked) return fallback;
    var labelText = checked.dataset.label;
    return labelText || fallback;
  }

  function updateRoomStrip(roomSlug) {
    if (!roomStripEl) return;
    var roomInfo = roomSlug && roomSlug !== 'all' ? roomMap[roomSlug] : null;
    if (!roomInfo) {
      roomStripEl.hidden = true;
      return;
    }
    if (roomAvifEl) roomAvifEl.setAttribute('srcset', roomInfo.avif || '');
    if (roomWebpEl) roomWebpEl.setAttribute('srcset', roomInfo.webp || '');
    if (roomImgEl) {
      roomImgEl.setAttribute('src', roomInfo.jpg || '');
      roomImgEl.setAttribute('alt', roomInfo.alt || roomInfo.heading || '');
    }
    if (roomEyebrowEl) roomEyebrowEl.textContent = roomInfo.eyebrow || roomInfo.label || '';
    if (roomHeadingEl) roomHeadingEl.textContent = roomInfo.heading || '';
    if (roomIntroEl) roomIntroEl.textContent = roomInfo.intro || '';
    if (roomLinkEl) {
      roomLinkEl.setAttribute('href', roomInfo.href || '/shop/');
      roomLinkEl.textContent = 'Open ' + (roomInfo.label || 'room') + ' page →';
    }
    roomStripEl.hidden = false;
  }

  function render() {
    var state = currentState();
    var visibleCount = 0;

    var sorted = cards.slice().sort(function (a, b) {
      if (state.sort === 'name-asc') {
        return String(a.dataset.name || '').localeCompare(String(b.dataset.name || ''));
      }
      if (state.sort === 'price-asc' || state.sort === 'price-desc') {
        var pa = priceOf(a);
        var pb = priceOf(b);
        var fa = Number.isFinite(pa);
        var fb = Number.isFinite(pb);
        if (fa && fb && pa !== pb) return state.sort === 'price-asc' ? pa - pb : pb - pa;
        if (fa !== fb) return fa ? -1 : 1;
      }
      return Number(a.dataset.index || 0) - Number(b.dataset.index || 0);
    });

    sorted.forEach(function (card) {
      var price = priceOf(card);
      var okRoom = state.room === 'all' || card.dataset.room === state.room;
      var okStatus = state.status === 'all' ||
        (state.status === 'preview' && card.dataset.sample === 'false') ||
        (state.status === 'sample' && card.dataset.sample === 'true');
      var okTier = matchesTier(price, state.tier);
      var show = okRoom && okStatus && okTier;
      card.hidden = !show;
      if (show) visibleCount++;
      grid.appendChild(card);
    });

    updateRoomStrip(state.room);

    if (countEl) {
      countEl.textContent = 'Showing ' + visibleCount + ' of ' + totalCount + (totalCount === 1 ? ' piece' : ' pieces');
    }
    if (emptyEl) emptyEl.hidden = visibleCount > 0;
    grid.hidden = visibleCount === 0;

    var active = hasActiveFilter(state);
    resetButtons.forEach(function (btn) {
      btn.hidden = !active;
      btn.disabled = !active;
    });

    if (summaryEl) {
      var roomText = labelForChecked('room', 'All rooms');
      var sortSelect = form.querySelector('select[name="sort"]');
      var sortText = sortSelect && sortSelect.selectedIndex >= 0
        ? sortSelect.options[sortSelect.selectedIndex].textContent
        : 'Curated order';
      summaryEl.textContent = roomText + ' · ' + sortText;
    }

    syncUrl(state);
  }

  function resetAll() {
    Object.keys(defaults).forEach(function (key) {
      var radio = form.querySelector('input[name="' + key + '"][value="' + defaults[key] + '"]');
      if (radio) radio.checked = true;
    });
    var sortSelect = form.querySelector('select[name="sort"]');
    if (sortSelect) sortSelect.value = defaults.sort;
    render();
  }

  function syncDisclosureViewport() {
    if (!disclosureEl) return;
    if (window.matchMedia('(min-width: 1024px)').matches) {
      disclosureEl.open = true;
    } else if (!hasActiveFilter(currentState())) {
      disclosureEl.open = false;
    }
  }

  applyQueryToForm();
  syncDisclosureViewport();
  render();

  form.addEventListener('change', render);
  resetButtons.forEach(function (btn) {
    btn.addEventListener('click', resetAll);
  });

  if (window.matchMedia) {
    var mq = window.matchMedia('(min-width: 1024px)');
    if (mq.addEventListener) mq.addEventListener('change', syncDisclosureViewport);
  }
})();
