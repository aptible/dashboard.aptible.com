import Ember from 'ember';
import Attestation from 'diesel/models/attestation';
import SPDRouteMixin from 'diesel/mixins/routes/spd-route';
import buildSecurityControlGroups from 'diesel/utils/build-security-control-groups';

export default Ember.Route.extend(SPDRouteMixin, {
  stepName: 'security-controls',
  complianceStatus: Ember.inject.service(),
  model() {
    let handle = 'selected_data_environments';
    let organization = this.get('complianceStatus.organization');
    let organizationProfile = this.modelFor('setup');
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
    }).catch(() => {
      // No exisisting data environment attestation
      // Redirect to set up new data environment attestation
      this.transitionTo('setup.data-environments');
    });
  }
});
