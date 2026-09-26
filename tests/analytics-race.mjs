import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);

async function testEmbedWaitsForIframeLoad() {
  const source = await readFile(new URL('assets/embed.js', root), 'utf8');
  const iframeListeners = new Map();
  const windowListeners = new Map();
  const sentMessages = [];
  let insertedIframe;

  const iframe = {
    style: {},
    contentWindow: {
      postMessage(message, origin) {
        sentMessages.push({ message, origin });
      }
    },
    setAttribute() {},
    addEventListener(name, listener) {
      iframeListeners.set(name, listener);
    }
  };
  const container = {
    replaceChildren(child) {
      insertedIframe = child;
    }
  };
  const window = {
    location: { href: 'https://kuechen-klas.de/lp/stilfinder/' },
    matchMedia: () => ({ matches: false }),
    CookieConsent: { acceptedService: () => true },
    addEventListener(name, listener) {
      windowListeners.set(name, listener);
    },
    dispatchEvent() {}
  };
  const context = vm.createContext({
    URL,
    URLSearchParams,
    CustomEvent: class CustomEvent {},
    console,
    window,
    document: {
      currentScript: {
        src: 'https://stilfinder.kuechen-klas.de/assets/embed.js',
        dataset: { analyticsProfile: 'stilfinder' }
      },
      getElementById: () => container,
      createElement: () => iframe
    }
  });

  vm.runInContext(source, context);
  assert.equal(insertedIframe, iframe, 'iframe should be inserted after setup');
  assert.equal(sentMessages.length, 0, 'context must not be posted before iframe load');

  windowListeners.get('klas:consent-applied')({ detail: { acceptedProviders: ['matomo'] } });
  assert.equal(sentMessages.length, 0, 'early consent must be retained without posting to the parent origin');

  iframeListeners.get('load')();
  assert.equal(sentMessages.length, 1, 'latest context should be posted once the iframe is ready');
  assert.equal(sentMessages[0].origin, 'https://stilfinder.kuechen-klas.de');
  assert.equal(sentMessages[0].message.analytics.matomo_allowed, true);
}

async function testAnalyticsDeduplicatesConsent() {
  const source = await readFile(new URL('assets/analytics.js', root), 'utf8');
  const trackerListeners = new Map();
  const appendedScripts = [];
  const parent = { postMessage() {} };
  const window = { parent };
  const context = vm.createContext({
    URL,
    console,
    window,
    document: {
      createElement: () => ({
        addEventListener(name, listener) {
          trackerListeners.set(name, listener);
        }
      }),
      head: { appendChild(script) { appendedScripts.push(script); } }
    }
  });

  vm.runInContext(source, context);
  const apply = window.KuechenKompassAnalytics.applyContext;
  const allowed = { profile: 'stilfinder', matomo_allowed: true };
  const denied = { profile: 'stilfinder', matomo_allowed: false };

  apply(denied, 'https://kuechen-klas.de');
  assert.equal(appendedScripts.length, 0, 'MTM container must not load before Matomo consent');

  apply(allowed, 'https://kuechen-klas.de');
  apply(allowed, 'https://kuechen-klas.de');
  trackerListeners.get('load')();
  apply(allowed, 'https://kuechen-klas.de');

  const countMatomo = command => (window._paq || []).filter(entry => entry[0] === command).length;
  const countMtm = event => window._mtm.filter(entry => entry.event === event).length;
  assert.equal(appendedScripts.length, 1, 'MTM container must only be loaded once');
  assert.equal(
    appendedScripts[0].src,
    'https://analytics.kuechen-klas.de/js/container_1ZzpGfcK.js',
    'unexpected MTM container URL'
  );
  assert.equal(countMtm('mtm.Start'), 1, 'repeated allowed context must not start MTM twice');
  assert.equal(countMtm('klas.consent_ready'), 1, 'repeated allowed context must not publish consent twice');
  assert.equal(countMatomo('disableCookies'), 0, 'embedded MTM tracker must use the container cookie configuration');

  apply(denied, 'https://kuechen-klas.de');
  apply(denied, 'https://kuechen-klas.de');
  assert.equal(countMatomo('forgetConsentGiven'), 1, 'repeated denied context must not revoke consent twice');
  assert.equal(countMatomo('HeatmapSessionRecording::disable'), 1, 'repeated denied context must not disable recording twice');

  apply(allowed, 'https://kuechen-klas.de');
  apply(allowed, 'https://kuechen-klas.de');
  assert.equal(appendedScripts.length, 1, 'renewed consent must reuse the loaded MTM container');
  assert.equal(countMatomo('setConsentGiven'), 1, 'renewed consent must be granted exactly once');
  assert.equal(countMatomo('HeatmapSessionRecording::enable'), 1, 'renewed consent must enable recording exactly once');
  assert.equal(countMtm('klas.consent_ready'), 2, 'renewed consent must be published to MTM exactly once');
}

await testEmbedWaitsForIframeLoad();
await testAnalyticsDeduplicatesConsent();
console.log('Analytics race regression tests passed.');
