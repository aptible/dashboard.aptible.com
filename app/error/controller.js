import Ember from "ember";

export default Ember.Controller.extend({

  errorCode: function(){
    return this.get('model.status') || this.get('model.name');
  }.property('model.status', 'model.name'),

  title: Ember.computed.alias('model.statusText'),

  message: function(){
    const errorLabel = this.get('model.responseJSON.message') || 'Our JavaScript raised an exception';
    return `${errorLabel}. Maybe the URL you visited is no longer valid?`;
  }.property('model.responseJSON.message')
});
