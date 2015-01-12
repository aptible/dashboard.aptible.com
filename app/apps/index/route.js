import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.find('stack');
  },

  setupController: function(controller, model){
    controller.set('stacks', model);
  }
});
