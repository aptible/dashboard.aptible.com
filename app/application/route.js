import Ember from "ember";
import config from '../config/environment';

export default Ember.Route.extend({
  raven: Ember.inject.service(),
  actions: {
    accessDenied() {
      this.transitionTo('login');
    },

    error(err) {
      this.intermediateTransitionTo('error', err);

      if(!config.sentry.development)  {
        this.get('raven').captureException(err);
      } else {
        this._super(...arguments);
      }
    }
  }
});

