(() => {
  'use strict';

  const storageKey = 'impulseLaboReadingFontSize';
  const legacyKey = 'cavendishReadingFontSize';
  const allowed = new Set(['standard', 'large', 'xlarge']);
  const root = document.documentElement;
  const buttons = Array.from(document.querySelectorAll('[data-font-size]'));

  const normalize = (value) => allowed.has(value) ? value : 'standard';

  const apply = (value, persist = true) => {
    const size = normalize(value);
    root.dataset.readingFont = size;
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.fontSize === size));
    });
    if (persist) {
      try { localStorage.setItem(storageKey, size); } catch (_) {}
    }
  };

  let saved = 'standard';
  try {
    saved = localStorage.getItem(storageKey) || localStorage.getItem(legacyKey) || 'standard';
  } catch (_) {}

  apply(saved);
  buttons.forEach((button) => {
    button.addEventListener('click', () => apply(button.dataset.fontSize));
  });
})();
