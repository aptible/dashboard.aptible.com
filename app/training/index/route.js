import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('training').criteria;
  },

  sssafterModel(model) {
    return model.map(c => c.get('documents'));
  },

  setupController(controller, model) {
    let organization = this.modelFor('organization');

    controller.set('criteria', model);
    controller.set('model', organization.get('users'));
    controller.set('organization', organization);
  }
});
