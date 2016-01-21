import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('training').criteria;
  },

  afterModel(model) {
    return Ember.RSVP.all(model.map(c => c.get('documents')));
  },

  setupController(controller, model) {
    let organization = this.modelFor('organization');

    controller.set('criteria', model);
    controller.set('model', organization.get('users'));
    controller.set('organization', organization);
  }
});
