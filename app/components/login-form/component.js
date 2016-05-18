import Ember from 'ember';

export default Ember.Component.extend({
  autofocusEmail: Ember.computed.not("emailDisabled"),
  autofocusPassword: Ember.computed.not("autofocusEmail"),

  actions: {
    login() {
      // Propagate to route
      this.sendAction();
    }
  }
});
