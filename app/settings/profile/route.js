import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.session.get('currentUser');
  },

  setupController: function(controller, model){
    controller.set('model', model);
    controller.set('userName', model.get('name'));
  },

  actions: {
    submit: function(newName){
      var user = this.currentModel;
      user.set('name', newName);
      user.save();
    }
  }
});
