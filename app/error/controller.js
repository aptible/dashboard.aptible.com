import Ember from "ember";

export default Ember.Controller.extend({
  title: Ember.computed.alias('model.statusText'),

  errorCode: Ember.computed('model.status', 'model.name', function() {
    return this.get('model.status') || this.get('model.name');
  }),

  message: Ember.computed('model.responseJSON.message', function() {
    const errorLabel = this.get('model.responseJSON.message') || 'Our JavaScript raised an exception';
    return `${errorLabel}. Maybe the URL you visited is no longer valid?`;
  })
});
