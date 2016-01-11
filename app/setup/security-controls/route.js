import Ember from 'ember';
import Attestation from 'sheriff/models/attestation';
import SPDRouteMixin from 'sheriff/mixins/routes/spd-route';
import buildSecurityControlGroups from 'sheriff/utils/build-security-control-groups';

export default Ember.Route.extend(SPDRouteMixin, {
  afterModel(attestation) {
    // If an attestation was created in model hook or the attestation has no
    // selected data environments, we should go back and create a new
    // attestation

    if (attestation.get('isNew')) {
      return this.transitionTo('setup.data-environments');
    }
  },

  model() {
    let handle = 'selected_data_environments';
    let organizationUrl = this.modelFor('organization').get('data.links.self');
    let attestationParams = { handle, organizationUrl, document: [] };

    return Attestation.findOrCreate(attestationParams, this.store);
  },

  setupController(controller, model) {
    let dataEnvironments = model.get('document');
    let organizationUrl = this.modelFor('organization').get('data.links.self');

    controller.set('model', buildSecurityControlGroups(dataEnvironments));
    controller.set('organizationUrl', organizationUrl);
  },

  actions: {
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

        profile.save().then(() => {
          this.transitionTo(`setup.${profile.get('currentStep')}`);
        });
      });
    }
  }
});
