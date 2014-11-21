import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    return this.store.createRecord('user');
  },

  actions: {

    signup: function(){
      var user = this.currentModel;
      var route = this;
      user.save().then(function(){
        route.transitionTo('login');
      });
    }

  }

});
