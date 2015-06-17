import config from '../config/environment';

export default Ember.Service.extend({
  enableRaven() {
    return window.Raven && !config.sentry.development;
  },
  identify(attributes) {
    if(this.enableRaven()) {
      window.Raven.setUserContext(attributes);
    }
  },

  captureException(exception) {
    if(this.enableRaven()) {
      window.Raven.captureException(exception);
    }
  }
});