import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['security-control'],
  classNameBindings: ['key'],
  actions: {
    onChange() {
      this.sendAction('onChange');
    }
  }
});
