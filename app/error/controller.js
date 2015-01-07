import Ember from "ember";

export default Ember.Controller.extend({

  title: function(){
    return this.get('model.status') || this.get('model.name');
  }.property('model.status', 'model.name'),

  subTitle: Ember.computed.alias('model.statusText'),

  message: function(){
    return this.get('model.responseJSON.message')+'.' || 'Our JavaScript raised an exception.';
  }.property('model.responseJSON.message')

});
