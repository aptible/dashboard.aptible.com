import Ember from 'ember';

export default Ember.Controller.extend({
  error: null,
  newKey: null,

  // do not show the key that the user is in the progress of creating
  validKeys: function(){
    return this.get('model').filter(function(key){
      return key.get('isLoaded') && !key.get('isDirty');
    });
  }.property('model.@each.isLoaded', 'model.@each.isDirty')
});
