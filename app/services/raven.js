import RavenService from 'ember-cli-sentry/services/raven';
import Ember from 'ember';

export default RavenService.extend({
  captureException: function(error) {
    if (this.get('isRavenUsable')) {
      window.Raven.captureException(...arguments);
    }

    Ember.Logger.error(error);
  }
});
