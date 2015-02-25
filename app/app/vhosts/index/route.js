import Ember from "ember";

export default Ember.Route.extend({
  titleToken: function(){
    var app = this.modelFor('app');
    return `${app.get('handle')} Domains`;
  },
  redirect: function(model) {
    if(model.get('length') === 0) {
      return this.transitionTo('app.vhosts.new', this.modelFor('app'));
    }
  },

  actions: {
    startDeletion: function(){
      this.controller.set('error', null);
    },
    failDeletion: function(/* e */){
      this.controller.set('error', 'There was an error deleting the VHost.');
    },
    completeDeletion: function(){
      this.controller.set('error', null);
    }
  }
});
