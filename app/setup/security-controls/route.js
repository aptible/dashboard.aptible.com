import Ember from 'ember';
import { getSecurityControlGroups } from 'sheriff/utils/data-environment-schemas';
import SPDRouteMixin from 'sheriff/mixins/routes/spd-route';

export default Ember.Route.extend(SPDRouteMixin, {
  beforeModel() {
    let profile = this.modelFor('setup');
    let selectedDataEnvironments = profile.get('selectedDataEnvironments');

    if(!selectedDataEnvironments || !selectedDataEnvironments.length) {
      return this.transitionTo('setup.data-environments');
    }
  },

  afterModel() {},

  model() {
    let profile = this.modelFor('setup');
    let selectedDataEnvironments = profile.get('selectedDataEnvironments');

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
