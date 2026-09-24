(() => {
  'use strict';

  const script = document.currentScript;
  if (!script) return;

  const containerId = script.dataset.container || 'kuechen-kompass';
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Küchen-Kompass: Container #${containerId} wurde nicht gefunden.`);
    return;
  }

  const defaultUrl = new URL('../', script.src);
  const iframeUrl = new URL(script.dataset.url || defaultUrl.href, window.location.href);
  iframeUrl.searchParams.set('embed', '1');

  const reducedMotion = typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const iframe = document.createElement('iframe');
  iframe.src = iframeUrl.href;
  iframe.title = script.dataset.title || 'Küchen-Kompass – Stil und Planungsprofil erstellen';
  iframe.loading = script.dataset.loading || 'lazy';
  iframe.style.display = 'block';
  iframe.style.width = '100%';
  iframe.style.minHeight = script.dataset.minHeight || '720px';
  iframe.style.border = '0';
  iframe.style.background = 'transparent';
  // Jeder Fragen-/Ergebnisschritt hat eine andere Höhe; ohne diesen Übergang
  // springt die Elternseite bei jedem kuechen-kompass:resize hart statt
  // weich mitzuwachsen.
  iframe.style.transition = reducedMotion ? 'none' : 'height 0.25s ease';
  iframe.setAttribute('allow', 'clipboard-write');

  container.replaceChildren(iframe);

  let visitorId = String(script.dataset.visitorId || '').trim();
  const validVisitorId = value => /^[A-Za-z0-9._:-]{8,128}$/.test(value);
  const source = String(script.dataset.source || 'kuechen-kompass-embed').trim();
  const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'];
  const parentParameters = new URLSearchParams(window.location.search);
  const campaign = Object.fromEntries(campaignKeys.flatMap(key => {
    const value = String(parentParameters.get(key) || '').normalize('NFC').trim();
    if (value === '' || value.length > 80 || /[\r\n\0]/.test(value)) return [];
    return [[key, value]];
  }));

  const sendContext = () => {
    if (!iframe.contentWindow) return;
    iframe.contentWindow.postMessage({
      type: 'kuechen-kompass:context',
      visitor_id: validVisitorId(visitorId) ? visitorId : '',
      source: /^[A-Za-z0-9._:-]{1,80}$/.test(source) ? source : 'kuechen-kompass-embed',
      campaign
    }, iframeUrl.origin);
  };

  iframe.addEventListener('load', sendContext);

  // Die Hauptseite kann die opaque visitor_id nach Consent bzw. nach Initialisierung
  // des eigenen Attribution-Trackings nachreichen, ohne dass der Kompass selbst
  // Cookies oder Tracking-Skripte lesen muss.
  window.addEventListener('kuechen-kompass:set-context', event => {
    const nextVisitorId = String(event.detail?.visitor_id || '').trim();
    if (!validVisitorId(nextVisitorId)) return;
    visitorId = nextVisitorId;
    sendContext();
  });

  window.addEventListener('message', event => {
    if (event.source !== iframe.contentWindow || event.origin !== iframeUrl.origin) return;
    if (event.data?.type === 'kuechen-kompass:resize') {
      const height = Number(event.data.height);
      if (!Number.isFinite(height) || height < 200 || height > 10000) return;
      iframe.style.height = `${Math.ceil(height)}px`;
      return;
    }
    if (event.data?.type !== 'kuechen-kompass:event') return;
    const name = String(event.data.name || '');
    if (!['view', 'start', 'style_result', 'project_questions_start', 'contact_open', 'lead'].includes(name)) return;
    window.dispatchEvent(new CustomEvent('kuechen-kompass:event', {
      detail: { name, properties: event.data.properties || {} }
    }));
  });
})();
