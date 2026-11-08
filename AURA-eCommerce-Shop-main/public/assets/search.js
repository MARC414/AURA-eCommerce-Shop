/**
 * Site search over a build-generated index. Progressive enhancement: without
 * JavaScript the search page still explains itself and links to the shop.
 */
(function () {
  var results = document.querySelector('[data-search-results]');
  var status = document.querySelector('[data-search-status]');
  var input = document.querySelector('[data-search-input]');
  if (!results || !status) return;

  var params = new URLSearchParams(window.location.search);
  var query = (params.get('q') || '').trim();
  if (input) input.value = query;

  var setStatus = function (message) { status.textContent = message; };

  var clear = function () {
    while (results.firstChild) results.removeChild(results.firstChild);
  };

  var render = function (matches) {
    clear();
    matches.forEach(function (item) {
      var anchor = document.createElement('a');
      anchor.href = item.href;

      var copy = document.createElement('span');
      var title = document.createElement('span');
      title.className = 'result-title';
      title.textContent = item.title;
      copy.appendChild(title);

      if (item.description) {
        var description = document.createElement('span');
        description.className = 'result-description';
        description.textContent = item.description;
        copy.appendChild(description);
      }
      anchor.appendChild(copy);

      var type = document.createElement('span');
      type.className = 'result-type';
      type.textContent = item.type || '';
      anchor.appendChild(type);

      var entry = document.createElement('li');
      entry.appendChild(anchor);
      results.appendChild(entry);
    });
  };

  if (!query) {
    setStatus('Type a word above to search products, books, music and pages.');
    return;
  }

  setStatus('Searching…');

  fetch('/assets/search-index.json')
    .then(function (response) {
      if (!response.ok) throw new Error('Search index unavailable');
      return response.json();
    })
    .then(function (index) {
      var needle = query.toLowerCase();
      var matches = index.filter(function (item) {
        var haystack = [item.title, item.description, item.type, (item.keywords || []).join(' ')]
          .join(' ')
          .toLowerCase();
        return haystack.indexOf(needle) !== -1;
      });
      render(matches.slice(0, 40));
      setStatus(matches.length
        ? matches.length + (matches.length === 1 ? ' result' : ' results') + ' for “' + query + '”.'
        : 'Nothing matches “' + query + '” yet. The shop and the library are both still small.');
    })
    .catch(function () {
      setStatus('Search is unavailable right now. The shop index is still readable.');
    });
})();
