import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    onDismiss() {
      this.sendAction('onDismiss');
    }
  }
});
