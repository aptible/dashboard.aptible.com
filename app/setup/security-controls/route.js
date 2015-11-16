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
  }
});

