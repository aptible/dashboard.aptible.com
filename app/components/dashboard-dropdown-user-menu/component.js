import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    showIntercom() {
      if (window.Intercom) {
        window.Intercom('show');
      } else {
        alert("We currently use Intercom for in-app announcements, but it looks like your ad blocker prevented Intercom from loading.\n\nConsider disabling your ad blocker, or follow announcements on our blog!");
      }
    }
  }
});
