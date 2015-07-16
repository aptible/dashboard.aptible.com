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

    window.Raven.captureMessage = function(message, _options) {
      var options = _options || {};
      var exception = new Error(message + '');

      window.Raven.captureException(exception, options);
    };
  } else if (attempts < 10) {
    setTimeout(monkeyPatchRaven, 500);
  }
}
