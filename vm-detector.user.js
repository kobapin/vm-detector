// ==UserScript==
// @name VM detector
// @namespace https://violentmonkey.github.io
// @description Detector for scripts on Violentmonkey.
// @version 1.0
// @author Gerald <i@gerald.top>
// @match https://greasyfork.org/*
// @grant none
// ==/UserScript==

!function () {
  const warn = message => {
    console.warn('[VM detector]', message);
  };
  if (GM_info.scriptHandler !== 'Violentmonkey') {
    warn('This script only works for Violentmonkey.');
    return;
  }
  if (!external.Violentmonkey) {
    warn('This script requires Violentmonkey 2.6.4+.');
    return;
  }

  const $ = selector => document.querySelector(selector);
  const button = $('.install-link');
  if (!button) return;

  const name = button.dataset.scriptName;
  const namespace = button.dataset.scriptNamespace;
  const version = button.dataset.scriptVersion;
  external.Violentmonkey.isInstalled(name, namespace)
  .then(result => {
    if (result) {
      const compare = compareVersions(result, version);
      if (compare < 0) {
        button.textContent = button.dataset.updateLabel;
      } else if (compare > 0) {
        button.textContent = button.dataset.downgradeLabel;
      } else {
        button.textContent = button.dataset.reinstallLabel;
      }
    }
  });
}();

function compareVersions(a, b) {
  const va = a.split('.').map(i => +i);
  const vb = b.split('.').map(i => +i);
  for (let i = 0; i < va.length || i < vb.length; i++) {
    const ua = va[i];
    const ub = vb[i];
    if ((ua || ub) && (ua !== ub)) {
      return ua && (!ub || ua > ub) ? 1 : -1;
    }
  }
  return 0;
}
