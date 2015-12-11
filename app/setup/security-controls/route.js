import Ember from 'ember';
import { getSecurityControlGroups } from 'sheriff/utils/data-environment-schemas';
import Attestation from 'sheriff/models/attestation';
import SPDRouteMixin from 'sheriff/mixins/routes/spd-route';

export function getSelectedDataEnvironments(dataEnvironments) {
  return Ember.keys(dataEnvironments).filter((deName) => {
    return dataEnvironments[deName];
  });
}

export default Ember.Route.extend(SPDRouteMixin, {
  afterModel(attestation) {
    let selectedDataEnvironments = getSelectedDataEnvironments(attestation.get('document'));

    if(selectedDataEnvironments.length === 0) {
      return this.transitionTo('setup.data-environments');
    }
  },

  model() {
    let organization = this.modelFor('organization');
    let store = this.store;

    return Attestation.findOrCreate('data-environments', organization, {}, store);
  },

  setupController(controller, model) {
    let dataEnvironments = model.get('document');
    let selectedDataEnvironments = getSelectedDataEnvironments(dataEnvironments);
    let securityControlGroups = getSecurityControlGroups(selectedDataEnvironments);

    controller.set('model', securityControlGroups);
    controller.set('dataEnvironments', dataEnvironments);
  },

  actions: {
    onNext() {
      let profile = this.modelFor('setup');
      let organization = this.modelFor('organization');
      let promises = this.controller.get('model').map((securityGroup) => {
        let attestation = { handle: securityGroup.handle,
                            document: securityGroup.document,
                            organization: organization.get('data.links.self') };
        return this.store.createRecord('attestation', attestation).save();
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
