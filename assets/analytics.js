(() => {
  'use strict';

  const profiles = Object.freeze({
    stilfinder: Object.freeze({
      containerId: '1ZzpGfcK',
      baseUrl: 'https://analytics.kuechen-klas.de/'
    })
  });

  let activeProfile = '';
  let activeParentOrigin = '';
  let scriptState = 'idle';
  let consentGranted = false;
  let mtmConsentGranted = false;

  function isAllowedParentOrigin(origin) {
    try {
      const url = new URL(origin);
      return (url.protocol === 'https:'
          && (url.hostname === 'kuechen-klas.de' || url.hostname.endsWith('.kuechen-klas.de')))
        || url.origin === 'http://kuechen-klas-2026.test';
    } catch (_) {
      return false;
    }
  }

  function reportStatus(status) {
    if (window.parent === window || !isAllowedParentOrigin(activeParentOrigin)) return;
    window.parent.postMessage({
      type: 'kuechen-kompass:analytics-status',
      status,
      profile: activeProfile
    }, activeParentOrigin);
  }

  function queueMatomo(command) {
    window._paq = window._paq || [];
    window._paq.push(command);
  }

  function queueMtm(value) {
    window._mtm = window._mtm || [];
    window._mtm.push(value);
  }

  function publishMtmConsent() {
    queueMtm({
      event: 'klas.consent_ready',
      consent_providers: 'matomo'
    });
  }

  function initialize(profile) {
    const config = profiles[profile];
    if (!config || scriptState !== 'idle') return;

    scriptState = 'loading';
    activeProfile = profile;
    mtmConsentGranted = true;

    publishMtmConsent();
    queueMtm({ 'mtm.startTime': Date.now(), event: 'mtm.Start' });

    const tracker = document.createElement('script');
    tracker.async = true;
    tracker.defer = true;
    tracker.referrerPolicy = 'no-referrer';
    tracker.src = `${config.baseUrl}js/container_${encodeURIComponent(config.containerId)}.js`;
    tracker.addEventListener('load', () => {
      scriptState = 'ready';
      reportStatus(consentGranted ? 'ready' : 'disabled');
    }, { once: true });
    tracker.addEventListener('error', () => {
      scriptState = 'error';
      reportStatus('error');
    }, { once: true });
    document.head.appendChild(tracker);
  }

  function applyContext(value, parentOrigin) {
    if (!isAllowedParentOrigin(parentOrigin)) return;
    const profile = String(value?.profile || '');
    if (!Object.hasOwn(profiles, profile)) return;

    activeProfile = profile;
    activeParentOrigin = parentOrigin;
    consentGranted = value?.matomo_allowed === true;

    if (!consentGranted) {
      if ((scriptState === 'ready' || scriptState === 'loading') && mtmConsentGranted) {
        queueMatomo(['HeatmapSessionRecording::disable']);
        queueMatomo(['forgetConsentGiven']);
        mtmConsentGranted = false;
      }
      reportStatus('disabled');
      return;
    }

    if (scriptState === 'idle') {
      initialize(profile);
      return;
    }
    if (scriptState === 'error') {
      reportStatus('error');
      return;
    }

    if (!mtmConsentGranted) {
      queueMatomo(['setConsentGiven']);
      queueMatomo(['HeatmapSessionRecording::enable']);
      publishMtmConsent();
      mtmConsentGranted = true;
    }
    if (scriptState === 'ready') reportStatus('ready');
  }

  window.KuechenKompassAnalytics = Object.freeze({ applyContext });
})();
