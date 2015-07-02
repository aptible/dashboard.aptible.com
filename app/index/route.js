import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('organization');
  },
  afterModel: function(model) {
    return this.transitionTo('training', model.get('firstObject'));
  }
});

