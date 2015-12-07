import Ember from 'ember';
import { getSecurityControlGroups } from 'sheriff/utils/data-environment-schemas';
import SPDRouteMixin from 'sheriff/mixins/routes/spd-route';

export function getSelectedDataEnvironments(dataEnvironments) {
  let selectedDataEnvironments = [];

  for (var deName in dataEnvironments) {
    if (dataEnvironments[deName]) {
      selectedDataEnvironments.push(deName);
    }
  }

  return selectedDataEnvironments;
}

export default Ember.Route.extend(SPDRouteMixin, {
  beforeModel() {
    // TODO: Selected data environments should actually be loaded by attestaion
    // and not as a field on organizationProfile.  Requires attestion fetch API

    let profile = this.modelFor('setup');
    let dataEnvironments = profile.get('selectedDataEnvironments') || {};
    let selectedDataEnvironments = getSelectedDataEnvironments(dataEnvironments);

    if(selectedDataEnvironments.length === 0) {
      return this.transitionTo('setup.data-environments');
    }
  },

  afterModel() {},

  model() {
    let profile = this.modelFor('setup');
    let dataEnvironments = profile.get('selectedDataEnvironments');
    let selectedDataEnvironments = getSelectedDataEnvironments(dataEnvironments);

    return getSecurityControlGroups(selectedDataEnvironments);
  },

  actions: {
    onNext() {
      let profile = this.modelFor('setup');
      let organization = this.modelFor('organization');
      let promises = this.currentModel.map((securityGroup) => {
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
