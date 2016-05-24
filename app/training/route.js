import Ember from 'ember';
import Attestation from 'diesel/models/attestation';

export function isTrainingCriterion(criterion) {
  return /training_log/.test(criterion.get('handle'));
}

export default Ember.Route.extend({
  model() {
    let handle = 'workforce_roles';
    let organizationProfile = this.modelFor('engines');
    let attestationParams = { handle, organizationProfile, document: [] };
    let attestation = Attestation.findOrCreate(attestationParams, this.store);

    let criteria = new Ember.RSVP.Promise((resolve, reject) => {
      this.store.find('criterion').then(function(criteria) {
        resolve(criteria.filter(isTrainingCriterion));
      }, reject);
    });

    return Ember.RSVP.hash({ criteria, attestation });
  }
});
