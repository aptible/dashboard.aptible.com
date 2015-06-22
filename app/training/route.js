import Ember from 'ember';

function isTrainingCriterion(criterion) {
  return /training_log/.test(criterion.get('handle'));
}

export default Ember.Route.extend({
  model() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.store.find('criterion').then(function(criteria) {
        let trainingCriteria = criteria.filter((c) => {
          return isTrainingCriterion(c);
        });

        resolve(trainingCriteria);
      }, () => reject());
    });
  },
  setupController(controller, model) {
    controller.set('organization', this.modelFor('organization'));
    controller.set('model', model);
  }
});
