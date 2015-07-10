import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    let trainingCriteria = this.modelFor('training').criteria;
    return trainingCriteria.findBy('handle', params.criterion_handle);
  },

  afterModel(model) {
    return model.get('documents');
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('organization', this.modelFor('organization'));
  }
});