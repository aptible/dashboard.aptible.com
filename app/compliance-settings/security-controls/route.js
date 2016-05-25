import Ember from 'ember';
import Attestation from 'diesel/models/attestation';
import buildSecurityControlGroups from 'diesel/utils/build-security-control-groups';

export default Ember.Route.extend({
  model() {
    let handle = 'selected_data_environments';
    let organization = this.modelFor('compliance-organization');
    let organizationProfile = this.modelFor('compliance-settings');
    let attestationParams = { handle, organizationProfile, document: [] };

    return new Ember.RSVP.Promise((resolve, reject) => {
      Attestation
        .findOrCreate(attestationParams, this.store)
        .then((dataEnvironments) => {
          if (dataEnvironments.get('isNew') || dataEnvironments.get('document.length') === 0) {
            reject();
          }

          let dataEnvironmentSelections = dataEnvironments.get('document');
          let groups = buildSecurityControlGroups(dataEnvironmentSelections,
                                                  organization, organizationProfile,
                                                  this.store);
          resolve(groups);
        }, reject);
    });
  }
});
