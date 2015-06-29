import Ember from 'ember';

function isTrainingCriterion(criterion) {
  return /training_log/.test(criterion.get('handle'));
}

export default Ember.Route.extend({
  model() {
    let criteria = new Ember.RSVP.Promise((resolve, reject) => {
      this.store.find('criterion').then(function(criteria) {
        let trainingCriteria = criteria.filter((c) => {
          return isTrainingCriterion(c);
        });

        resolve(trainingCriteria);
      }, () => reject());
    });

    return Ember.RSVP.hash({
      criteria: criteria,
      permissions: this.store.find('permission')
    });
  },

  afterModel(model) {
    let organization = this.modelFor('organization');
    let permissions = model.permissions;

    // Organization requires all permissions in order to determine developers
    organization.set('permissions', permissions);

    return Ember.RSVP.hash({
      developers: organization.get('developerRoles').map(r => r.get('users'))
    });
  },

  setupController(controller, model) {
    controller.set('organization', this.modelFor('organization'));
    controller.set('model', model.criteria);
  }
});

