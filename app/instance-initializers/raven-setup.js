import Ember from 'ember';
import config from '../config/environment';

// Ember merge is deprecated as of 2.5, but we need to check for backwards
// compatibility.
const assign = Ember.assign || Ember.merge;

export function initialize(application) {

  if (Ember.get(config, 'sentry.development') === true) {
    if (Ember.get(config, 'sentry.debug') === true) {
      Ember.Logger.info('`sentry` is configured for development mode.');
    }
    return;
  }

  if (!config.sentry) {
    throw new Error('`sentry` should be configured when not in development mode.');
  }

  const {
    dsn,
    debug = true,
    includePaths = [],
    whitelistUrls = [],
    serviceName = 'raven',
    serviceReleaseProperty = 'release',
    ravenOptions = {}
  } = config.sentry;

  const lookupName = `service:${serviceName}`;
  const service = application.container.lookup(lookupName);

  try {
    window.Raven.debug = debug;

    // Keeping existing config values for includePaths, whitelistUrls, for compatibility.
    const ravenConfig = assign({
      includePaths,
      whitelistUrls,
      release: service.get(serviceReleaseProperty) || config.APP.version
    }, ravenOptions);

    window.Raven.config(dsn, ravenConfig);
  } catch (e) {
    Ember.Logger.warn('Error during `sentry` initialization: ' + e);
    return;
  }

  window.Raven.install();

  const { globalErrorCatching = true } = config.sentry;

  if (globalErrorCatching === true) {
    service.enableGlobalErrorCatching();
  }
}

export default {
  initialize,
  name: 'sentry-setup'
};
