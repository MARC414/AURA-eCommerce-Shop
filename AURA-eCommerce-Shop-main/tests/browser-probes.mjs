/** Browser-side regression probes. Serialize a probe into an actual Shop tab. */
export function referenceStyleProbe() {
  const css = element => getComputedStyle(element);
  const need = (actual, wanted, label) => { if (actual !== wanted) throw new Error(`${label}: expected ${wanted}, got ${actual}`); };
  need(document.documentElement.scrollWidth <= innerWidth, true, 'Horizontal overflow');
  need(document.querySelectorAll('h1').length, 1, 'Single H1');
  const card = document.querySelector('.product-card');
  if (card) {
    need(css(card).borderTopWidth, '1px', 'Whole-card frame');
    need(css(card.querySelector('.card-image')).backgroundColor, 'rgb(226, 225, 220)', 'Paper image well');
    need(css(card.querySelector('.card-copy')).padding, '18px 18px 20px', 'Inset metadata');
  }
  const hero = document.querySelector('.reference-hero');
  if (hero && innerWidth === 1440) {
    const heading = css(hero.querySelector('h1'));
    need(heading.fontSize, '84px', 'Hero display scale');
    need(heading.lineHeight, '75.6px', 'Hero display leading');
    need(Math.round(hero.querySelector('.reference-hero__copy').getBoundingClientRect().left), 88, 'Hero left inset');
    need(css(hero.querySelector('.reference-hero__background')).opacity, '0.78', 'Supplied background opacity');
  }
  const detail = document.querySelector('.reference-product__details');
  if (detail) {
    need(css(detail).backgroundColor, 'rgb(47, 51, 43)', 'Moss details');
    const image = document.querySelector('.main-image').getBoundingClientRect();
    const cap = innerWidth > 1100 ? 520 : innerWidth > 760 ? 400 : 440;
    need(image.width <= cap + 1, true, 'Gallery cap');
  }
  return { passed: true, width: innerWidth };
}

export function newsletterHiddenStateProbe() {
  const remove = document.querySelector('[data-newsletter-remove]');
  if (!remove) throw new Error('Newsletter removal control missing');
  remove.click();
  if (getComputedStyle(remove).display !== 'none') throw new Error('Removal control still renders after preference removal');
  return { passed: true };
}

export function shopVisibilityProbe() {
  const form = document.querySelector('[data-shop-form]');
  const grid = document.querySelector('[data-shop-grid]');
  const count = document.querySelector('[data-shop-count]');
  const empty = document.querySelector('[data-shop-empty]');
  const reset = document.querySelector('[data-shop-reset]');
  if (!form || !grid || !count || !empty || !reset) throw new Error('Shop controls missing');

  const renderedCount = () => [...grid.querySelectorAll('.product-card')]
    .filter(card => getComputedStyle(card).display !== 'none' && card.getBoundingClientRect().height > 0).length;
  const expect = (actual, wanted, label) => {
    if (actual !== wanted) throw new Error(`${label}: expected ${wanted}, received ${actual}`);
  };
  const choose = (name, value) => {
    const input = form.querySelector(`input[name="${name}"][value="${value}"]`);
    if (!input) throw new Error(`Missing ${name}: ${value}`);
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };

  reset.click();
  expect(renderedCount(), 9, 'Unfiltered rendered cards');
  choose('room', 'everyday-care');
  expect(count.textContent, 'Showing 3 of 9 pieces', 'Room count');
  expect(renderedCount(), 3, 'Room rendered cards');
  choose('room', 'art-craft');
  choose('status', 'preview');
  expect(count.textContent, 'Showing 0 of 9 pieces', 'Empty count');
  expect(renderedCount(), 0, 'Empty rendered cards');
  expect(getComputedStyle(grid).display, 'none', 'Empty grid');
  expect(empty.hidden, false, 'Recovery visibility');
  empty.querySelector('[data-shop-reset]').click();
  expect(renderedCount(), 9, 'Reset rendered cards');
  expect(empty.hidden, true, 'Reset recovery');
  expect(location.search, '', 'Reset URL');
  return { passed: true, cases: ['unfiltered: 9', 'Everyday Care: 3', 'empty: 0', 'reset: 9'] };
}
