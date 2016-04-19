/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'sheriff',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',

    authBaseUri: process.env.AUTH_BASE_URI || "http://localhost:4000",
    apiBaseUri: process.env.API_BASE_URI || "http://localhost:4001",
    gridironBaseUri: process.env.GRIDIRON_BASE_URI || "http://localhost:4002",
    complianceBaseUri: process.env.COMPLIANCE_BASE_URI || 'http://localhost:4201',
    dashboardBaseUri: process.env.DASHBOARD_BASE_URI || 'http://localhost:4200',
    aptibleHosts: {
      compliance: 'http://localhost:3001',
      dashboard: 'http://localhost:4200',
      support: "https://support.aptible.com"
    },

    complianceEngines: [
      { name: 'Risk Assessment', path: 'risk', app: 'compliance' },
      { name: 'Policies & Procedures', path: 'policy', app: 'compliance' },
      { name: 'Application Security', path: 'security', app: 'compliance' },
      { name: 'Workforce Training', path: 'training' }
    ],

    complianceTools: [
      { name: 'Incident Response', path: 'incidents', app: 'compliance' },
      { name: 'Contract Management', path: 'contracts', app: 'compliance' }
    ],

    'ember-cli-toggle': {
      includedThemes: ['light', 'default', 'flip', 'ios'],
      excludedThemes: ['flip'],
      defaultShowLabels: true, // defaults to false
      defaultTheme: 'light',   // defaults to 'default'
      defaultSize: 'small',    // defaults to 'medium'
      defaultOff: 'False',     // defaults to 'Off'
      defaultOn: 'True'        // defaults to 'On'
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
      timeout: 6500,
      showProgress: true,
      injectionFactories : ['route', 'router', 'controller', 'view']
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
      'connect-src': "'self' http://aptible1.local:4000 http://aptible1.local:4001 http://aptible1.local:4002 http://aptible1.local:4004 http://localhost:4000 http://localhost:4001 http://localhost:4002 ws://localhost:35729 ws://0.0.0.0:35729 http://api.mixpanel.com http://api.segment.io https://auth.aptible-staging.com https://api.aptible-staging.com https://gridiron.aptible-staging.com https://api-ping.intercom.io wss://*.intercom.io https://*.intercom.io",
      'style-src': "'self' 'unsafe-inline' http://use.typekit.net",
      'img-src': "'self' http://www.gravatar.com https://secure.gravatar.com http://www.google-analytics.com http://p.typekit.net https://track.customer.io https://js.intercomcdn.com",
      'script-src': "'self' 'unsafe-inline' https://js.stripe.com https://api.stripe.com http://use.typekit.net http://cdn.segment.com https://assets.customer.io http://www.google-analytics.com http://cdn.mxpnl.com https://js.intercomcdn.com https://static.intercomcdn.com https://widget.intercom.io",
      'font-src': "'self' data:",
      'object-src': "http://localhost:4200"
    },

    featureFlags: {
      'organization-settings': true,
      'price-estimator': true,
      'notifications': false
    }

  };

  if (environment === 'development') {
    ENV.APP.LOG_RESOLVER = false;
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_TRANSITIONS = true;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
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
    delete ENV.gridironBaseUri;

    // https://github.com/poteto/ember-cli-flash/issues/32
    // Flash messages with a timeout will pause andThen()'s for the timeout
    // duration.  Forcing flashes to be sticky will allow them to be detectable
    ENV.flashMessageDefaults.sticky = true;
  }

  if (environment === 'staging') {
    ENV.authBaseUri = "https://auth.aptible-staging.com";
    ENV.apiBaseUri = "https://api.aptible-staging.com";
    ENV.dashboardBaseUri = 'https://dashboard.aptible-staging.com';
    ENV.complianceBaseUri = 'https://compliance.aptible-staging.com';
    ENV.gridironBaseUri = 'https://gridiron.aptible-staging.com';
    ENV.aptibleHosts = {
      'compliance': 'https://compliance.aptible-staging.com',
      dashboard: 'https://dashboard.aptible-staging.com',
      support: "https://support.aptible-staging.com"
    };
    ENV.segmentioKey = '6jZlAcweTojgXShBvn4B9Tvwr1IlqkEE';
    ENV.featureFlags['price-estimator'] = false;
  }

  if (environment === 'production') {
    ENV.stripePublishableKey = 'pk_live_ujeTeUIMpUcvNsWwu7R9b3Zy';
    ENV.authBaseUri = "https://auth.aptible.com";
    ENV.apiBaseUri = "https://api.aptible.com";
    ENV.dashboardBaseUri = 'https://dashboard.aptible.com';
    ENV.complianceBaseUri = 'https://compliance.aptible.com';
    ENV.gridironBaseUri = 'https://gridiron.aptible.com';
    ENV.aptibleHosts = {
      compliance: 'https://compliance.aptible.com',
      dashboard: "https://dashboard.aptible.com",
      support: "https://support.aptible.com"
    };
    ENV.segmentioKey = '5aOlxMYapu6bQCQYFbDz7rhNvVV7B1A5';
    ENV.featureFlags['organization-settings'] = true;
    ENV.featureFlags['price-estimator'] = false;
    ENV.featureFlags['notifications'] = true;
  }

  return ENV;
};
