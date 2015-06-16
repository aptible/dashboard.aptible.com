export default Ember.Service.extend({
  identify(attributes) {
    if(window.Raven) {
      window.Raven.setUserContext(attributes);
    }
  },

  captureException(exception) {
    if(window.Raven) {
      window.Raven.captureException(exception);
    }
  }
});