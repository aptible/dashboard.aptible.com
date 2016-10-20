import Ember from 'ember';
import Attestation from 'diesel/models/attestation';
import buildSecurityControlGroups from 'diesel/utils/build-security-control-groups';
import config from 'diesel/config/environment';

export default Ember.Route.extend({
  model() {
    let handle = 'selected_data_environments';
    let organization = this.get('complianceStatus.organization');
    let organizationProfile = this.modelFor('gridiron-settings');
    let attestationParams = { handle, organizationProfile, document: [] };

    return new Ember.RSVP.Promise((resolve, reject) => {
      Attestation
        .findOrCreate(attestationParams, this.store)
        .then((dataEnvironments) => {
          let dataEnvironmentSelections = {};

          if(config.featureFlags.dataEnvironments) {
            if (dataEnvironments.get('isNew') || dataEnvironments.get('document.length') === 0) {
              reject();
            }
            dataEnvironmentSelections = dataEnvironments.get('document');
          }

          let groups = buildSecurityControlGroups(dataEnvironmentSelections,
                                                  organization, organizationProfile,
                                                  this.store);
          resolve(groups);
        }, reject);
    });
  }
});
