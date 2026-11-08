/**
 * Account page: the invoice requests saved in this browser. No login, no
 * server lookup, no network call. Removing an entry removes the local record
 * only; a written invoice sent by email is unaffected.
 */
(function () {
  var list = document.querySelector('[data-account-orders]');
  var empty = document.querySelector('[data-account-empty]');
  var status = document.querySelector('[data-account-status]');
  if (!list) return;

  if (!window.AuraStore) {
    if (status) status.textContent = 'This list needs JavaScript. Nothing has been sent anywhere.';
    return;
  }

  function money(value, currency) {
    try {
      return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency || 'GBP' }).format(value);
    } catch (error) {
      return value.toFixed(2) + ' ' + (currency || '');
    }
  }

  function dateLabel(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Date not recorded';
    return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }

  function render() {
    var orders = window.AuraStore.getOrders();
    while (list.firstChild) list.removeChild(list.firstChild);

    if (!orders.length) {
      list.hidden = true;
      if (empty) empty.hidden = false;
      if (status) status.textContent = 'No request is saved in this browser.';
      return;
    }

    if (empty) empty.hidden = true;
    list.hidden = false;

    orders.forEach(function (order) {
      var item = document.createElement('li');
      item.className = 'order-item';

      var head = document.createElement('div');
      head.className = 'order-head';

      var reference = document.createElement('strong');
      reference.className = 'order-reference';
      reference.textContent = order.reference;
      head.appendChild(reference);

      var state = document.createElement('span');
      state.className = 'badge';
      state.textContent = 'Invoice requested';
      head.appendChild(state);

      var meta = document.createElement('p');
      meta.className = 'order-meta';
      meta.textContent = dateLabel(order.createdAt) + (order.customer && order.customer.email ? ' · ' + order.customer.email : '');

      var items = document.createElement('ul');
      items.className = 'order-lines';
      (order.items || []).forEach(function (line) {
        var row = document.createElement('li');
        row.textContent = line.quantity + ' × ' + line.name + (line.selectedVariant ? ' · ' + line.selectedVariant : '');
        items.appendChild(row);
      });

      var total = document.createElement('p');
      total.className = 'order-total';
      total.textContent = order.subtotal === null || order.subtotal === undefined
        ? 'Amount on invoice'
        : money(order.subtotal, order.currency) + ' before delivery';

      var remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'text-link order-remove';
      remove.textContent = 'Remove from this browser';
      remove.setAttribute('data-order-remove', order.reference);
      remove.setAttribute('aria-label', 'Remove request ' + order.reference + ' from this browser');

      item.appendChild(head);
      item.appendChild(meta);
      item.appendChild(items);
      item.appendChild(total);
      item.appendChild(remove);
      list.appendChild(item);
    });

    if (status) {
      status.textContent = orders.length + (orders.length === 1 ? ' request saved in this browser.' : ' requests saved in this browser.');
    }
  }

  list.addEventListener('click', function (event) {
    var button = event.target.closest('[data-order-remove]');
    if (!button) return;
    window.AuraStore.removeOrder(button.getAttribute('data-order-remove'));
  });

  window.addEventListener('aura_order_saved', render);
  window.addEventListener('storage', function (event) {
    if (event.key === window.AuraStore.ORDER_KEY) render();
  });

  render();
})();
