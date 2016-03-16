import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['panel-section security-control'],
  classNameBindings: ['key'],
  actions: {
    onChange() {
      this.sendAction('onChange');
    }
  }
});
