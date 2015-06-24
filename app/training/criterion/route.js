import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    let trainingCriteria = this.modelFor('training').criteria;

    return Ember.RSVP.hash({
      criterion: trainingCriteria.findBy('handle', params.criterion_handle),
      permissions: this.store.find('permission')
    });
  },

  setupController(controller, model) {
    controller.set('model', model.criterion);
    controller.set('permissions', model.permissions);
    controller.set('organization', this.modelFor('organization'));
  }
});