import Ember from "ember";
import config from '../config/environment';

Error.stackTraceLimit = 999;

export default Ember.Route.extend({
  raven: Ember.inject.service(),
  actions: {
    accessDenied() {
      this.transitionTo('login');
    },

    xerror(err) {
      this.intermediateTransitionTo('error', err);

      if(!config.sentry.development)  {
        this.get('raven').captureException(err);
      } else {
        this._super(...arguments);
      }
    }
  }
});

