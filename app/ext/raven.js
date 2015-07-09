/* global TraceKit */

import config from '../config/environment';

let attempts = 0;

export default function monkeyPatchRaven() {
  var originalCaptureMessage;

  if (config.sentry.skipCdn) {
    return;
  }

  attempts++;

  if (window.Raven) {
    originalCaptureMessage = window.Raven.captureMessage;

    window.Raven.captureMessage = function(message, options) {
      var exception = new Error('Fake exception to track the stack of [object Object] errors.');

      options.stacktrace = TraceKit.computeStackTrace(exception);

      originalCaptureMessage.call(window.Raven, message, options);
    };
  } else if (attempts < 10) {
    setTimeout(monkeyPatchRaven, 500);
  }
}
