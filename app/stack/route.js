import Ember from 'ember';

export default Ember.Route.extend({
  title: function(tokens) {
    if (tokens.length === 0) {
      tokens.push(this.currentModel.get('handle'));
    }

    // org is a PromiseProxy, pre-populated because it was
    // fetched in `afterModel`
    let organization = this.currentModel.get('organization');
    tokens.push( organization.get('name') );

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
