'use strict';

const assert = require('node:assert/strict');
const { createImageLoader } = require('../assets/image-loader.js');

let requests = [];
let failuresRemaining = 1;

class FakeImage {
  set src(value) {
    requests.push(value);
    queueMicrotask(() => {
      if (failuresRemaining > 0) {
        failuresRemaining -= 1;
        this.onerror?.(new Error('simulated transient image failure'));
        return;
      }
      this.onload?.();
    });
  }
}

async function main() {
  const loader = createImageLoader({
    imageFactory: () => new FakeImage(),
    wait: () => Promise.resolve(),
    retryToken: () => 'retry-token'
  });

  const url = 'https://stilfinder.kuechen-klas.de/assets/images/example.webp';
  const loadedUrl = await loader.load(url);
  assert.equal(requests.length, 2, 'A transient failure must trigger exactly one retry.');
  assert.equal(requests[0], url, 'The first request must use the canonical asset URL.');
  assert.match(requests[1], /kk_retry=retry-token/, 'The retry must bypass a cached network failure.');
  assert.equal(loadedUrl, requests[1], 'The successfully loaded retry URL must be returned.');

  const cachedUrl = await loader.load(url);
  assert.equal(cachedUrl, loadedUrl, 'A successful image must be reused.');
  assert.equal(requests.length, 2, 'A cached success must not create another request.');

  console.log('Image loader tests passed.');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
