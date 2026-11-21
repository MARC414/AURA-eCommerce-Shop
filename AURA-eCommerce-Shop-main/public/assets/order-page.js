/**
 * Browser-local order request lookup for /order/.
 * Requires BOTH an exact invoice reference and the matching checkout email
 * before revealing request details. Reads AuraStore / localStorage only;
 * no network calls or backend assumptions.
 */
(function (global) {
  'use strict';

  var ORDER_KEY = 'aura_order_requests_v1';

  function readStoredOrders() {
    if (global.AuraStore && typeof global.AuraStore.getOrders === 'function') {
      return global.AuraStore.getOrders();
    }
    try {
      var raw = global.localStorage && global.localStorage.getItem(ORDER_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function getOrder(reference, email) {
    var refKey = String(reference || '').trim().toUpperCase();
    var emailKey = String(email || '').trim().toLowerCase();
    if (!refKey || !emailKey) return null;

    var orders = readStoredOrders();
    for (var i = 0; i < orders.length; i += 1) {
      var candidate = orders[i];
      if (!candidate || typeof candidate.reference !== 'string') continue;
      var candidateRef = candidate.reference.trim().toUpperCase();
      var candidateEmail = candidate.customer && typeof candidate.customer.email === 'string'
        ? candidate.customer.email.trim().toLowerCase()
        : '';
      if (candidateRef === refKey && candidateEmail === emailKey) {
        return {
          reference: candidate.reference,
          date: candidate.createdAt || '',
          status: 'Request received — awaiting confirmation',
          items: Array.isArray(candidate.items) ? candidate.items : [],
          paymentMethod: candidate.paymentMethod || 'Confirmed on written invoice',
          subtotal: candidate.subtotal === undefined ? null : candidate.subtotal,
          currency: candidate.currency || 'GBP',
          priceOnRequest: Boolean(candidate.priceOnRequest),
          country: candidate.customer && candidate.customer.country ? candidate.customer.country : ''
        };
      }
    }
    return null;
  }

  global.AuraOrderLookup = {
    getOrder: getOrder
  };

  var doc = global.document;
  if (!doc) return;

  var form = doc.querySelector('[data-order-form]');
  var status = doc.querySelector('[data-order-status]');
  var result = doc.querySelector('[data-order-result]');
  if (!form || !result) return;

  function money(value, currency) {
    try {
      return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency || 'GBP' }).format(value);
    } catch (error) {
      return Number(value).toFixed(2) + ' ' + (currency || '');
    }
  }

  function dateLabel(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Date not recorded';
    return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }

  function clearResult() {
    while (result.firstChild) result.removeChild(result.firstChild);
    result.hidden = true;
  }

  function renderFound(order) {
    clearResult();

    var card = doc.createElement('div');
    card.className = 'order-item';

    var head = doc.createElement('div');
    head.className = 'order-head';

    var refHeading = doc.createElement('strong');
    refHeading.className = 'order-reference';
    refHeading.textContent = order.reference;
    head.appendChild(refHeading);

    var badge = doc.createElement('span');
    badge.className = 'badge';
    badge.textContent = order.status;
    head.appendChild(badge);
    card.appendChild(head);

    var meta = doc.createElement('p');
    meta.className = 'order-meta';
    meta.textContent = dateLabel(order.date) + (order.country ? ' · Destination: ' + order.country : '');
    card.appendChild(meta);

    var method = doc.createElement('p');
    method.className = 'order-meta';
    method.textContent = 'Preferred settlement: ' + order.paymentMethod;
    card.appendChild(method);

    var lines = doc.createElement('ul');
    lines.className = 'order-lines';
    order.items.forEach(function (line) {
      var li = doc.createElement('li');
      li.textContent = String(line.quantity || 1) + ' × ' + (line.name || 'Item') + (line.selectedVariant ? ' · ' + line.selectedVariant : '');
      lines.appendChild(li);
    });
    card.appendChild(lines);

    var total = doc.createElement('p');
    total.className = 'order-total';
    total.textContent = order.subtotal === null || order.priceOnRequest
      ? 'Amount on invoice (confirmed before payment)'
      : money(order.subtotal, order.currency) + ' before delivery';
    card.appendChild(total);

    var notice = doc.createElement('p');
    notice.className = 'small-note';
    notice.textContent = 'Saved on this browser only — no live carrier or billing server is connected yet.';
    card.appendChild(notice);

    result.appendChild(card);
    result.hidden = false;
  }

  function runLookup(reference, email) {
    var found = getOrder(reference, email);
    if (!found) {
      clearResult();
      if (status) {
        status.textContent = 'No matching request was found in this browser for that reference and email.';
      }
      return;
    }
    if (status) status.textContent = 'Request found in this browser.';
    renderFound(found);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      if (status) status.textContent = 'Enter both your invoice reference and matching email address.';
      return;
    }
    var refInput = form.elements.reference;
    var emailInput = form.elements.email;
    runLookup(refInput ? refInput.value : '', emailInput ? emailInput.value : '');
  });

  try {
    var params = new URLSearchParams(global.location ? global.location.search : '');
    var qRef = params.get('ref');
    var qEmail = params.get('email');
    if (qRef && form.elements.reference) form.elements.reference.value = qRef;
    if (qEmail && form.elements.email) form.elements.email.value = qEmail;
    if (qRef && qEmail) runLookup(qRef, qEmail);
  } catch (error) {
    /* Query string optional. */
  }
})(window);
