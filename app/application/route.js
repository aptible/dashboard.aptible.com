import Ember from "ember";
import config from '../config/environment';

export default Ember.Route.extend({
  raven: Ember.inject.service(),
  actions: {
    accessDenied() {
      this.transitionTo('login');
    },

    error(err) {
      if(config.sentry.development)  {
        this._super(...arguments);
      } else {
        this.get('raven').captureException(err);
        this.intermediateTransitionTo('error', err);
      }
    }
  }
});

