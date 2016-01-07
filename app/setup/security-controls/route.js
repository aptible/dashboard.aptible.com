import Ember from 'ember';
import { getSecurityControlGroups } from 'sheriff/utils/data-environment-schemas';
import Attestation from 'sheriff/models/attestation';
import SPDRouteMixin from 'sheriff/mixins/routes/spd-route';
import BuildSecurityControlGroups from 'sheriff/utils/build-security-control-groups';

export function getSelectedDataEnvironments(dataEnvironments) {
  return Ember.keys(dataEnvironments).filter((deName) => {
    return dataEnvironments[deName];
  });
}

export default Ember.Route.extend(SPDRouteMixin, {
  afterModel(attestation) {
    let selectedDataEnvironments = getSelectedDataEnvironments(attestation.get('document'));

    // If an attestation was created in model hook or the attestation has no
    // selected data environments, we should go back and create a new
    // attestation

    if(attestation.get('isNew') || selectedDataEnvironments.length === 0) {
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
    let organization = this.modelFor('organization').get('data.links.self');
    let selectedDataEnvironments = getSelectedDataEnvironments(dataEnvironments);

    controller.set('model',
      BuildSecurityControlGroups(selectedDataEnvironments, organization, this.store)
    );
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
