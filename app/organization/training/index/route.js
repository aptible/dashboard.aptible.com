import Ember from 'ember';

function isTrainingCriterion(criterion) {
  return /training_log/.test(criterion.get('handle'));
}

export default Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      users: this.modelFor('organization').get('users'),
      criteria: this.store.find('criterion'),
      permissions: this.store.find('permission')
    });
  },
  afterModel: function(model) {
    let trainingDocuments = model.criteria.map(function(criterion) {
      if(isTrainingCriterion(criterion)) {
        return criterion.get('documents');
      }
    });

    return Ember.RSVP.hash({
      roles: this.modelFor('organization').get('roles'),
      securityOfficer: this.modelFor('organization').get('securityOfficer'),
      documents: trainingDocuments
    });
  },
  setupController: function(controller, model) {
    let trainingCriteria = model.criteria.filter(function(criterion) {
      return isTrainingCriterion(criterion);
    });

    controller.set('criteria', trainingCriteria);
    controller.set('permissions', model.permissions);
    controller.set('model', model.users);
    controller.set('organization', this.modelFor('organization'));
  }
});
