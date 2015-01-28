import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller){
    var user = this.session.get('currentUser');

    controller.set('userName', user.get('name'));
  },

  actions: {
    submit: function(newName){
      var user = this.session.get('currentUser');
      user.set('name', newName);
      user.save();
    }
  }
});
