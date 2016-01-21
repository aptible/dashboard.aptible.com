import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    let trainingCriteria = this.modelFor('training').criteria;
    return trainingCriteria.findBy('handle', params.criterion_handle);
  },

  afterModel() {
    let organization = this.modelFor('organization');
    let criteria = this.modelFor('training').criteria;

    return Ember.RSVP.hash({
      documents: Ember.RSVP.all(criteria.map(c => c.get('criteria'))),
      users: organization.get('users')
    });
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('organization', this.modelFor('organization'));
  }
});