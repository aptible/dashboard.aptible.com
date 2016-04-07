import Ember from 'ember';
import Attestation from 'sheriff/models/attestation';
import SPDRouteMixin from 'sheriff/mixins/routes/spd-route';
import buildSecurityControlGroups from 'sheriff/utils/build-security-control-groups';

export default Ember.Route.extend(SPDRouteMixin, {
  stepName: 'security-controls',

  model() {
    let handle = 'selected_data_environments';
    let organizationUrl = this.modelFor('organization').get('data.links.self');
    let attestationParams = { handle, organizationUrl, document: [] };

    return new Ember.RSVP.Promise((resolve, reject) => {
      Attestation
        .findOrCreate(attestationParams, this.store)
        .then((dataEnvironments) => {
          if (dataEnvironments.get('isNew')) {
            reject();
          }

          let dataEnvironmentSelections = dataEnvironments.get('document');
          let organizationUrl = this.modelFor('organization').get('data.links.self');
          let groups = buildSecurityControlGroups(dataEnvironmentSelections,
                                                  organizationUrl, this.store);
          resolve(groups);
        }, reject)
    }).catch(() => {
      // No exisisting data environment attestation
      // Redirect to set up new data environment attestation
      this.transitionTo('setup.data-environments');
    });
  },

  actions: {
    onSave() {
      let securityControlGroups = this.controller.get('model');
      let promises = securityControlGroups.map((securityControlGroup) => {
        let { document, attestation } = securityControlGroup;
        attestation.set('document', document.dump({ excludeInvalid: true }));
        return attestation.save();
      });

      Ember.RSVP.all(promises).then(() => {
        let message = `All Security Control Groups saved.`;
        Ember.get(this, 'flashMessages').success(message);
      }, (e) => {
        let message = Ember.getWithDefault(e, 'responseJSON.message', 'An error occured');
        Ember.get(this, 'flashMessages').danger(`Save Failed! ${message}`);
      });
    },

    onNext() {
      let profile = this.modelFor('setup');
      let securityControlGroups = this.controller.get('model');
      let promises = securityControlGroups.map((securityControlGroup) => {
        let { document, attestation } = securityControlGroup;
        attestation.set('document', document.dump({ excludeInvalid: true }));
        return attestation.save();
      });

      Ember.RSVP.all(promises).then(() => {
        profile.next(this.get('stepName'));
        profile.set('hasCompletedSetup', true);

        return profile.save().then(() => {
          this.transitionTo(`setup.${profile.get('currentStep')}`);
        });
      }).catch((e) => {
        let message = Ember.getWithDefault(e, 'responseJSON.message', 'An error occured');
        Ember.get(this, 'flashMessages').danger(`Save Failed! ${message}`);
      });
    }
  }
});
