import Ember from 'ember';
import Schema from 'ember-json-schema/models/schema';
import aptibleSchemaJson from 'sheriff/schemas/providers/aptible';
import { getSecurityControlGroups } from 'sheriff/utils/data-environment-schemas';

export default Ember.Route.extend({
  beforeModel() {
    let profile = this.modelFor('setup');
    let selectedDataEnvironments = profile.get('selectedDataEnvironments');

    if(!selectedDataEnvironments || !selectedDataEnvironments.length) {
      return this.transitionTo('setup.data-environments');
    }
  },

  model() {
    let profile = this.modelFor('setup');
    let selectedDataEnvironments = profile.get('selectedDataEnvironments');

    return getSecurityControlGroups(selectedDataEnvironments);
  },

  actions: {
    onNext() {
      let profile = this.modelFor('setup');

      let promises = this.currentModel.map((securityGroup) => {
        // REVIEW: This creates an attestation for each provider, data
        // environment, and global.  Should these be consolodated?
        let attestation = { handle: securityGroup.handle,
                            document: securityGroup.document };
        return this.store.createRecord('attestation', attestation).save();
      });

      Ember.RSVP.all(promises).then(() => {
        profile.next();
        profile.set('hasCompletedSetup', true);

        profile.save().then(() => {
          this.transitionTo(`setup.${profile.get('currentStep')}`);
        });
      });
    }
  }
});

