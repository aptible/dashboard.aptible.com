import Ember from 'ember';
import Attestation from 'diesel/models/attestation';

export function isTrainingCriterion(criterion) {
  return /training_log/.test(criterion.get('handle'));
}

export default Ember.Route.extend({
  complianceStatus: Ember.inject.service(),
  model() {
    let handle = 'workforce_roles';
    let organizationProfile = this.get('complianceStatus.organizationProfile');
    let attestationParams = { handle, organizationProfile, document: [] };
    let attestation = Attestation.findOrCreate(attestationParams, this.store);
    let criteria = this.get('complianceStatus.criteria').filter(isTrainingCriterion);

    return Ember.RSVP.hash({ criteria, attestation });
  }
});
