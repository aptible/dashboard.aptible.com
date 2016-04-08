import Ember from 'ember';
import Attestation from 'sheriff/models/attestation';
import buildSecurityControlGroups from 'sheriff/utils/build-security-control-groups';

export default Ember.Route.extend({
  model() {
    let handle = 'selected_data_environments';
    let organizationUrl = this.modelFor('organization').get('data.links.self');
    let attestationParams = { handle, organizationUrl, document: [] };

    return new Ember.RSVP.Promise((resolve, reject) => {
      Attestation
        .findOrCreate(attestationParams, this.store)
        .then((dataEnvironments) => {
          if (dataEnvironments.get('isNew') || dataEnvironments.get('document.length') === 0) {
            reject();
          }

          let dataEnvironmentSelections = dataEnvironments.get('document');
          let organizationUrl = this.modelFor('organization').get('data.links.self');
          let groups = buildSecurityControlGroups(dataEnvironmentSelections,
                                                  organizationUrl, this.store);
          resolve(groups);
        }, reject);
    });
  }
});
