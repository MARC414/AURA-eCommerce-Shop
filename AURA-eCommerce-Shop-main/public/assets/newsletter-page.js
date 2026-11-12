/**
 * Newsletter preference: saved in this browser until a mailing service is
 * connected. No network call, no address leaves the device.
 */
(function () {
  var form = document.querySelector('[data-newsletter-form]');
  var status = document.querySelector('[data-newsletter-status]');
  var remove = document.querySelector('[data-newsletter-remove]');
  if (!form) return;

  if (!window.AuraStore) {
    if (status) status.textContent = 'This form needs JavaScript. Nothing has been sent anywhere.';
    form.hidden = true;
    return;
  }

  var input = form.querySelector('input[type="email"]');
  // The homepage sets this attribute: inside a section, a status line at rest
  // would read as a warning. There the status speaks only after an action; the
  // newsletter page keeps its full rest state.
  var quiet = form.hasAttribute('data-newsletter-quiet');

  function show(preference, announce) {
    if (!input) return;
    if (preference) {
      input.value = preference.email;
      if (status) status.textContent = announce ? 'Saved in this browser as ' + preference.email + '. The mailing service is not connected yet; nothing has been sent.' : '';
      if (remove) remove.hidden = false;
    } else {
      if (status) status.textContent = announce ? 'No address is saved in this browser.' : '';
      if (remove) remove.hidden = true;
    }
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var email = String(new window.FormData(form).get('email') || '').trim();
    if (!email) return;
    show(window.AuraStore.saveNewsletter(email), true);
  });

  if (remove) {
    remove.addEventListener('click', function () {
      window.AuraStore.removeNewsletter();
      if (input) input.value = '';
      show(null, true);
    });
  }

  show(window.AuraStore.getNewsletter(), !quiet);
})();
