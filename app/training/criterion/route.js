import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    let trainingCriteria = this.modelFor('training').criteria;
    return trainingCriteria.findBy('handle', params.criterion_handle);
  },

  ssssafterModel(model) {
    return this.modelFor('training').criteria.map(c => c.get('documents'));
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('organization', this.modelFor('organization'));
  }
});