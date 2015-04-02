/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'diesel',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',

    authBaseUri: process.env.AUTH_BASE_URI || "http://localhost:4000",
    apiBaseUri: process.env.API_BASE_URI || "http://localhost:4001",
    aptibleHosts: {
      'compliance': 'http://localhost:3001',
      'legacy-dashboard': "http://localhost:3000",
      support: "https://support.aptible.com"
    },

    authTokenKey: '_aptible_authToken',
    stripePublishableKey: 'pk_test_eiw5HXHTAgTwyNnV9I5ruCrA',
    replaceLocation: true,
    replaceTitle: true,

    segmentioKey: 'Jp74HTqG03zhS4cAJK4pueo2FL1Z6bM3',

    externalUrls: {
      gettingStartedDocs: 'https://support.aptible.com/hc/en-us/articles/202638630-Deploying-your-first-app'
    },

    flashMessageDefaults: {
      // https://github.com/poteto/ember-cli-flash#service-defaults
      timeout: 6000,
      showProgress: true
    },

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
      'connect-src': "'self' http://localhost:4000 http://localhost:4001 ws://localhost:35729 ws://0.0.0.0:35729 http://api.mixpanel.com http://api.segment.io http://auth.aptible.foundry.io http://api.aptible.foundry.io",
      'style-src': "'self' 'unsafe-inline' http://use.typekit.net",
      'img-src': "'self' http://www.gravatar.com https://secure.gravatar.com http://www.google-analytics.com http://p.typekit.net https://track.customer.io",
      'script-src': "'self' 'unsafe-inline' https://js.stripe.com https://api.stripe.com http://use.typekit.net http://cdn.segment.com https://assets.customer.io http://www.google-analytics.com http://cdn.mxpnl.com",
      'font-src': "'self' data:",
      'object-src': "http://localhost:4200"
    },

    featureFlags: {
      'organization-settings': true,
      'price-estimator': true,
      'notifications': true
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
    ENV.replaceTitle = false;

    delete ENV.apiBaseUri;
    delete ENV.authBaseUri;
    ENV.legacyDashboardHost = 'http://legacy-dashboard-host.com';
  }

  if (environment === 'staging') {
    ENV.authBaseUri = "https://auth.aptible-staging.com";
    ENV.apiBaseUri = "https://api.aptible-staging.com";
    ENV.aptibleHosts = {
      'compliance': 'https://compliance.aptible-staging.com',
      'legacy-dashboard': "https://dashboard.aptible-staging.com",
      support: "https://support.aptible-staging.com"
    };
    ENV.segmentioKey = '6jZlAcweTojgXShBvn4B9Tvwr1IlqkEE';
    ENV.featureFlags['price-estimator'] = false;
  }

  if (environment === 'production') {
    ENV.authBaseUri = "https://auth.aptible.com";
    ENV.apiBaseUri = "https://api.aptible.com";
    ENV.aptibleHosts = {
      'compliance': 'https://compliance.aptible.com',
      'legacy-dashboard': "https://dashboard.aptible.com",
      support: "https://support.aptible.com"
    };
    ENV.segmentioKey = '5aOlxMYapu6bQCQYFbDz7rhNvVV7B1A5';
    ENV.featureFlags['organization-settings'] = false;
    ENV.featureFlags['price-estimator'] = false;
    ENV.featureFlags['notifications'] = false;
  }

  return ENV;
};
