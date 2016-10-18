import Ember from 'ember';
import { stubRequest } from 'ember-cli-fake-server';

// Location Schema
import workforceLocationsSchema from '../fixtures/schemas/workforce-locations';

// Selected Data Environments
//import selectedDataEnvironmentsSchema from '../fixtures/schemas/selected-data-environments';

//Security Control Schemas
import workforceSecurityControlsSchema from '../fixtures/schemas/workforce-security-controls';
import softwareDevelopmentLifecycleSecurityControlsSchema from '../fixtures/schemas/software-development-lifecycle-security-controls';

Ember.Test.registerHelper('stubSchemasAPI', function(app, options = {}) {
  // accept an array of handles to exclude.  Useful for individual tests providing
  // their own stubs
  let except = options.except || [];
  let schemas = { workforce_locations: workforceLocationsSchema,
                  SPD_human_resources_information_security: workforceSecurityControlsSchema,
                  SPD_secure_software_development: softwareDevelopmentLifecycleSecurityControlsSchema } ;

  Ember.keys(schemas).forEach((handle) => {
    if (except.indexOf(handle) === -1) {
      stubRequest('get', `/schemas/${handle}`, function() {
        return this.success(schemas[handle]);
      });
    }
  });
});

