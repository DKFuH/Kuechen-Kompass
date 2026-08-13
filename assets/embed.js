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

  const iframe = document.createElement('iframe');
  iframe.src = iframeUrl.href;
  iframe.title = script.dataset.title || 'Küchen-Kompass – persönlichen Küchenstil finden';
  iframe.loading = script.dataset.loading || 'lazy';
  iframe.style.display = 'block';
  iframe.style.width = '100%';
  iframe.style.minHeight = script.dataset.minHeight || '720px';
  iframe.style.border = '0';
  iframe.style.background = 'transparent';
  iframe.setAttribute('allow', 'clipboard-write');

  container.replaceChildren(iframe);

  window.addEventListener('message', event => {
    if (event.source !== iframe.contentWindow || event.origin !== iframeUrl.origin) return;
    if (event.data?.type !== 'kuechen-kompass:resize') return;
    const height = Number(event.data.height);
    if (!Number.isFinite(height) || height < 200 || height > 10000) return;
    iframe.style.height = `${Math.ceil(height)}px`;
  });
})();
