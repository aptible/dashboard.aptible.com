import Ember from 'ember';

export default Ember.Route.extend({
  afterModel: function(model){
    return Ember.RSVP.hash({
      apps: model.get('apps'),
      databases: model.get('databases')
    });
  },
  setupController: function(controller, model){
    var stacks = this.modelFor('stacks');
    controller.set('model', model);
    controller.set('stacks', stacks);
  }
});
