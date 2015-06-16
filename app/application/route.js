import Ember from 'ember';

export default Ember.Route.extend({
  requireAuthentication: false,
  sentry: Ember.inject.service(),
  title: 'Aptible Dashboard',
  actions: {
    error: function(err) {
      this.get('sentry').captureException(err);
      Ember.onerror(err);
      return true;
    }
  },
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
  }
});
