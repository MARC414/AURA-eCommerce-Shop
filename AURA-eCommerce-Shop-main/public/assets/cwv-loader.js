/**
 * OPAR Core Web Vitals Optimizer:
 * - Protects LCP images (product main photo, Shop hero, Homepage hero)
 * - Lazy-loads and pre-decodes non-critical below-the-fold media via IntersectionObserver
 * - Defers non-essential gallery warm-up and secondary scripts to idle frames
 * Zero external requests, zero telemetry.
 */
(function () {
  'use strict';

  var hasIdle = typeof window.requestIdleCallback === 'function';

  function whenIdle(task, timeout) {
    if (typeof task !== 'function') return;
    if (hasIdle) {
      window.requestIdleCallback(function () { task(); }, { timeout: timeout || 1500 });
      return;
    }
    window.setTimeout(task, 1);
  }

  function isCriticalLcpImage(img) {
    if (!img) return false;
    if (img.hasAttribute('data-main-image') && !img.hidden) return true;
    if (img.closest('.home-hero__photo, .shop-hero__media')) return true;
    if (img.closest('.site-header') && img.classList.contains('wordmark-emblem')) return true;
    return false;
  }

  function enforceLazyMedia(root) {
    var scope = root || document;
    var vh = window.innerHeight || 900;
    var images = scope.querySelectorAll('img');
    for (var i = 0; i < images.length; i++) {
      var img = images[i];
      if (isCriticalLcpImage(img)) {
        if (!img.getAttribute('decoding')) img.setAttribute('decoding', 'async');
        continue;
      }
      if (img.hasAttribute('data-main-image') && img.hidden && img.getAttribute('fetchpriority') === 'high') {
        img.removeAttribute('fetchpriority');
      }
      if (!img.getAttribute('decoding')) img.setAttribute('decoding', 'async');
      var rect = img.getBoundingClientRect ? img.getBoundingClientRect() : null;
      var offscreen = img.hidden || !rect || rect.top > vh * 1.05 || (rect.width === 0 && rect.height === 0);
      if (offscreen || img.closest('.related-section, .v2-habitat-plate, .paper-pause, .site-footer, .gallery-thumbnails, .product-cards, .room-index')) {
        if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
        if (img.getAttribute('fetchpriority') !== 'low') img.setAttribute('fetchpriority', 'low');
      }
    }

    var frames = scope.querySelectorAll('iframe');
    for (var j = 0; j < frames.length; j++) {
      if (!frames[j].getAttribute('loading')) frames[j].setAttribute('loading', 'lazy');
    }
  }

  function decodeQuietly(img) {
    if (!img || typeof img.decode !== 'function') return;
    if (img.complete && img.naturalWidth > 0) {
      img.decode().catch(function () {});
    }
  }

  function observeApproachingMedia(root) {
    var scope = root || document;
    var targets = Array.prototype.slice.call(
      scope.querySelectorAll('.v2-habitat-plate img, .related-section img, .paper-pause img, .product-cards img, .room-index__figure img, .spread-bg, .floating-specimen')
    );
    if (!targets.length) return;

    if (typeof window.IntersectionObserver !== 'function') {
      targets.forEach(decodeQuietly);
      return;
    }

    var io = new window.IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        if (!entry.isIntersecting) continue;
        var el = entry.target;
        el.setAttribute('data-cwv-observed', 'true');
        decodeQuietly(el);
        io.unobserve(el);
      }
    }, { rootMargin: '320px 0px', threshold: 0.01 });

    targets.forEach(function (img) {
      io.observe(img);
    });
  }

  function setupGalleryIntentWarmup(root) {
    var scope = root || document;
    var warmed = {};
    var buttons = scope.querySelectorAll('[data-gallery] [data-gallery-src]');
    for (var i = 0; i < buttons.length; i++) {
      (function (btn) {
        if (btn.dataset.galleryEmpty === 'true') return;
        var warm = function () {
          var src = btn.dataset.gallerySrc;
          if (!src || warmed[src]) return;
          warmed[src] = true;
          var pre = new window.Image();
          pre.decoding = 'async';
          pre.src = src;
        };
        btn.addEventListener('pointerenter', warm, { passive: true, once: true });
        btn.addEventListener('focus', warm, { passive: true, once: true });
      })(buttons[i]);
    }
  }

  window.OparCwv = {
    whenIdle: whenIdle,
    enforceLazyMedia: enforceLazyMedia,
    observeApproachingMedia: observeApproachingMedia,
    isCriticalLcpImage: isCriticalLcpImage
  };

  enforceLazyMedia(document);
  whenIdle(function () {
    observeApproachingMedia(document);
    setupGalleryIntentWarmup(document);
  }, 1200);
})();
