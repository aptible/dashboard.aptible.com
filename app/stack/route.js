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

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('organizations', this.store.find('organization'));
    controller.set('stacks', this.store.find('stack'));
  },

  afterModel: function(model){
    return Ember.RSVP.hash({
      apps: model.get('apps'),
      databases: model.get('databases'),
      organization: model.get('organization')
    });
  }
});
