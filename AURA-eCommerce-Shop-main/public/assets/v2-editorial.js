/**
 * OPAR Progressive Editorial Enhancements (loaded on primary generated pages).
 * Zero external requests, zero telemetry, safe under prefers-reduced-motion.
 */
(function () {
  'use strict';

  /* 1. PDP Folio Reference live SKU & rate sync + Copy folio link */
  var variantSelect = document.querySelector('[data-variant]');
  var skuEl = document.querySelector('[data-v2-folio-sku]');
  var rateEl = document.querySelector('[data-v2-folio-rate]');
  if (variantSelect && (skuEl || rateEl)) {
    function formatRate(amount, currency) {
      try {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency || 'GBP' }).format(amount) + ' ' + (currency || 'GBP');
      } catch (e) {
        return Number(amount).toFixed(2) + ' ' + (currency || '');
      }
    }

    function syncFolioRef() {
      var opt = !variantSelect.disabled && variantSelect.selectedIndex >= 0
        ? variantSelect.options[variantSelect.selectedIndex]
        : null;
      if (skuEl) {
        var nextSku = (opt && opt.dataset.variantSku) || skuEl.dataset.baseSku || '';
        if (nextSku) skuEl.textContent = nextSku;
      }
      if (rateEl) {
        var variantPrice = opt && opt.dataset.variantPrice;
        var currency = rateEl.dataset.currency || 'GBP';
        if (variantPrice !== undefined && variantPrice !== '' && Number.isFinite(Number(variantPrice))) {
          rateEl.textContent = formatRate(Number(variantPrice), currency);
        } else if (rateEl.dataset.baseRate) {
          rateEl.textContent = rateEl.dataset.baseRate;
        }
      }
    }

    variantSelect.addEventListener('change', syncFolioRef);
    syncFolioRef();
  }

  document.querySelectorAll('[data-v2-copy-folio]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var status = btn.parentElement && btn.parentElement.querySelector('[data-v2-copy-folio-status]');
      var url = window.location.href;
      if (!navigator.clipboard) {
        if (status) status.textContent = url;
        return;
      }
      navigator.clipboard.writeText(url).then(function () {
        btn.textContent = 'Folio link copied';
        if (status) status.textContent = 'Ready to share';
        window.setTimeout(function () {
          btn.textContent = 'Copy folio link';
          if (status) status.textContent = '';
        }, 1800);
      }).catch(function () {});
    });
  });

  /* 4. Scroll-Linked Orbital Astrolabe Rotation on .paper-opener__mark */
  var openerMarks = Array.from(document.querySelectorAll('.paper-opener__mark'));
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (openerMarks.length && !prefersReduced) {
    var ticking = false;
    var updateOrbit = function () {
      ticking = false;
      var maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var ratio = Math.max(0, Math.min(1, window.scrollY / Math.min(maxScroll, 1200)));
      var deg = (ratio * 8).toFixed(2) + 'deg';
      openerMarks.forEach(function (mark) {
        mark.style.setProperty('--v2-orbit-deg', deg);
      });
    };
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateOrbit);
    }, { passive: true });
    updateOrbit();
  }

  /* 5. Perennis Music Click-to-Consent Acoustic Listening Plate */
  var consentBtn = document.querySelector('[data-v2-consent-load]');
  var listeningDeck = document.querySelector('[data-v2-listening-deck]');
  var listeningVeil = document.querySelector('[data-v2-listening-veil]');
  if (consentBtn && listeningDeck) {
    consentBtn.addEventListener('click', function () {
      if (listeningVeil) listeningVeil.hidden = true;
      listeningDeck.hidden = false;
      listeningDeck.focus();
    });
  }

  /* 6. Checkout Atelier Proforma Enhancement */
  var proforma = document.querySelector('[data-v2-proforma]');
  var confirmation = document.querySelector('[data-checkout-confirmation]');
  if (proforma && confirmation) {
    function money(value, currency) {
      try {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency || 'GBP' }).format(value);
      } catch (e) {
        return Number(value).toFixed(2) + ' ' + (currency || '');
      }
    }

    function populateProforma() {
      if (confirmation.hidden || !window.AuraStore) return;
      var orders = window.AuraStore.getOrders();
      var latest = orders && orders[0];
      if (!latest) return;
      var refEl = proforma.querySelector('[data-v2-proforma-ref]');
      var recipientEl = proforma.querySelector('[data-v2-proforma-recipient]');
      var bodyEl = proforma.querySelector('[data-v2-proforma-lines]');
      var totalEl = proforma.querySelector('[data-v2-proforma-total]');
      if (refEl) refEl.textContent = latest.reference;
      if (recipientEl && latest.customer) {
        recipientEl.textContent = [latest.customer.name, latest.customer.city, latest.customer.country].filter(Boolean).join(' · ');
      }
      if (bodyEl && Array.isArray(latest.items)) {
        while (bodyEl.firstChild) bodyEl.removeChild(bodyEl.firstChild);
        latest.items.forEach(function (item) {
          var tr = document.createElement('tr');
          var tdName = document.createElement('td');
          tdName.textContent = item.name + (item.selectedVariant ? ' (' + item.selectedVariant + ')' : '');
          var tdQty = document.createElement('td');
          tdQty.textContent = String(item.quantity);
          var tdAmount = document.createElement('td');
          tdAmount.textContent = Number.isFinite(item.price)
            ? money(item.price * item.quantity, item.currency)
            : 'Price on request';
          tr.appendChild(tdName);
          tr.appendChild(tdQty);
          tr.appendChild(tdAmount);
          bodyEl.appendChild(tr);
        });
      }
      if (totalEl) {
        totalEl.textContent = latest.priceOnRequest
          ? 'Confirmed on invoice'
          : (Number.isFinite(latest.subtotal) ? money(latest.subtotal, latest.currency) : 'Confirmed on invoice');
      }
    }

    var copyBtn = proforma.querySelector('[data-v2-copy-ref]');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var refEl = proforma.querySelector('[data-v2-proforma-ref]');
        var refText = refEl ? refEl.textContent.trim() : '';
        if (!refText || !navigator.clipboard) return;
        navigator.clipboard.writeText(refText).then(function () {
          copyBtn.textContent = 'Reference copied';
          window.setTimeout(function () { copyBtn.textContent = 'Copy reference'; }, 1800);
        }).catch(function () {});
      });
    }

    var printBtn = proforma.querySelector('[data-v2-print-proforma]');
    if (printBtn) {
      printBtn.addEventListener('click', function () {
        window.print();
      });
    }

    var confirmObserver = new MutationObserver(populateProforma);
    confirmObserver.observe(confirmation, { attributes: true, attributeFilter: ['hidden'] });
    window.addEventListener('aura_order_saved', populateProforma);
    populateProforma();
  }
})();
