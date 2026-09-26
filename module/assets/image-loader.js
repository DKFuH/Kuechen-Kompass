(function (root, factory) {
  'use strict';

  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.KuechenKompassImages = api.createImageLoader();
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  function createImageLoader(dependencies = {}) {
    const imageFactory = dependencies.imageFactory || (() => new Image());
    const wait = dependencies.wait || (milliseconds => new Promise(resolve => window.setTimeout(resolve, milliseconds)));
    const retryToken = dependencies.retryToken || (() => `${Date.now()}-${Math.random().toString(36).slice(2)}`);
    const successes = new Map();

    function retryUrl(url) {
      const next = new URL(url, typeof document !== 'undefined' ? document.baseURI : 'https://localhost/');
      next.searchParams.set('kk_retry', retryToken());
      return next.href;
    }

    function request(url) {
      return new Promise((resolve, reject) => {
        const image = imageFactory();
        image.onload = () => resolve(url);
        image.onerror = () => reject(new Error(`Image could not be loaded: ${url}`));
        image.src = url;
      });
    }

    function load(url, options = {}) {
      const canonicalUrl = String(url || '');
      if (canonicalUrl === '') return Promise.reject(new Error('Image URL is missing.'));
      if (successes.has(canonicalUrl)) return successes.get(canonicalUrl);

      const maxAttempts = Math.max(1, Number(options.attempts) || 3);
      const run = async () => {
        let lastError;
        for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
          const requestedUrl = attempt === 0 ? canonicalUrl : retryUrl(canonicalUrl);
          try {
            return await request(requestedUrl);
          } catch (error) {
            lastError = error;
            if (attempt + 1 < maxAttempts) await wait(180 * (attempt + 1));
          }
        }
        throw lastError;
      };

      const pending = run().catch(error => {
        successes.delete(canonicalUrl);
        throw error;
      });
      successes.set(canonicalUrl, pending);
      return pending;
    }

    function bindElement(element, options = {}) {
      if (!element) return;
      const originalUrl = element.currentSrc || element.src;
      const maxAttempts = Math.max(1, Number(options.attempts) || 3);
      let attempt = 1;
      let retryTimer = null;

      const retry = () => {
        if (attempt >= maxAttempts) return;
        const delay = 180 * attempt;
        attempt += 1;
        retryTimer = setTimeout(() => {
          element.src = retryUrl(originalUrl);
        }, delay);
      };
      element.addEventListener('error', retry);
      element.addEventListener('load', () => {
        if (retryTimer !== null) clearTimeout(retryTimer);
      });
      if (element.complete && element.naturalWidth === 0) retry();
    }

    return Object.freeze({ load, bindElement });
  }

  return Object.freeze({ createImageLoader });
});
