import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('organization');
  },
  afterModel: function(model) {
    this.transitionTo('organization.training', model.objectAt(0));
  }
});
