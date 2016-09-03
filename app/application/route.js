import Ember from "ember";
import config from '../config/environment';

// Defining an error action at all will cause errors to be swallowed.
// This makes debugging in development impossible.  Use sentry.development
// flag to determine if we should even define an error action.
let onError = null;

if(config.environment === 'test' || !config.sentry.development) {
  onError = function(err) {
    this.get('raven').captureException(err);
    this.intermediateTransitionTo('error', err);
  };
}

export default Ember.Route.extend({
  requireAuthentication: false,
  title: 'Aptible Dashboard',
  raven: Ember.inject.service(),

  actions: {
    accessDenied() {
      this.transitionTo('login');
    },

    error: onError
  }
});