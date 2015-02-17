/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'diesel',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',

    authBaseUri: "http://localhost:4000",
    apiBaseUri: "http://localhost:4001",
    aptibleHosts: {
      'legacy-dashboard': "http://localhost:3000",
      support: "https://support.aptible.com"
    },

    authTokenKey: '_aptible_authToken',
    stripePublishableKey: 'pk_test_eiw5HXHTAgTwyNnV9I5ruCrA',
    replaceLocation: true,

    segmentioKey: 'qxwhj8ys4t',

    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    torii: {
      sessionServiceName: 'session'
    },

    contentSecurityPolicy: {
      'connect-src': "'self' http://localhost:4000 http://localhost:4001 ws://localhost:35729 ws://0.0.0.0:35729 http://api.mixpanel.com http://api.segment.io",
      'style-src': "'self' 'unsafe-inline' http://use.typekit.net",
      'img-src': "'self' http://www.gravatar.com https://secure.gravatar.com http://www.google-analytics.com http://p.typekit.net https://track.customer.io",
      'script-src': "'self' 'unsafe-inline' https://js.stripe.com https://api.stripe.com http://use.typekit.net http://cdn.segment.com https://assets.customer.io http://www.google-analytics.com http://cdn.mxpnl.com",
      'font-src': "'self' 'unsafe-inline'"
    }

  };

  if (environment === 'development') {
    ENV.APP.LOG_RESOLVER = false;
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV.authTokenKey = '_aptible_authToken-test';

    ENV.replaceLocation = false;

    delete ENV.apiBaseUri;
    delete ENV.authBaseUri;
    ENV.legacyDashboardHost = 'http://legacy-dashboard-host.com';
  }

  if (environment === 'staging') {
    ENV.authBaseUri = "https://auth.aptible-staging.com";
    ENV.apiBaseUri = "https://api.aptible-staging.com";
    ENV.aptibleHosts = {
      'legacy-dashboard': "http://dashboard.aptible-staging.com",
      support: "https://support.aptible-staging.com"
    };
  }

  if (environment === 'production') {

  }

  return ENV;
};
