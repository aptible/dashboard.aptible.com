import Ember from "ember";
import config from '../config/environment';

export default Ember.Route.extend({
  requireAuthentication: false,
  title: 'Aptible Dashboard',
  raven: Ember.inject.service(),
  activate() {
    if (this.get('features').isEnabled('notifications')) {
      this._oldOnError = Ember.onerror;
      this._errorHandler = (e) => {
        this.get('flashMessages').danger(e);
        if (this._oldOnError) {
          this._oldOnError(e);
        }
      };
      Ember.onerror = this._errorHandler;
    }
  },

  deactivate() {
    if (this.get('features').isEnabled('notifications')) {
      Ember.onerror = this._oldOnError;
    }
  },

  actions: {
    accessDenied() {
      this.transitionTo('login');
    },

    error(err) {
      if(config.environment !== 'test' && config.sentry.development)  {
        this._super(...arguments);
      } else {
        this.get('raven').captureException(err);
        this.intermediateTransitionTo('error', err);
      }
    }
  }
});
