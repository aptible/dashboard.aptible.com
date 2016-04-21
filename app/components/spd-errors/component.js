import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  errorMessages: Ember.computed('errors', function() {
    if (this.get('errors.length')) {
      return `${ this.get('errors').join(', ') }.`;
    }
  }),

  actions: {
    clearMessages() {
      this.set('errors', null);
    }
  }
});
