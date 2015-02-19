import Ember from 'ember';

export default Ember.Route.extend({
  title: function(tokens) {
    tokens.push(this.currentModel.get('handle'));
    return tokens.join(' - ');
  },
  afterModel: function(model){
    return Ember.RSVP.hash({
      apps: model.get('apps'),
      databases: model.get('databases'),
      organization: model.get('organization')
    });
  },
  setupController: function(controller, model){
    var stacks = this.modelFor('stacks');
    controller.set('model', model);
    controller.set('stacks', stacks);
  }
});
