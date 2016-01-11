import Ember from 'ember';
import { stubRequest } from 'ember-cli-fake-server';

// Location Schema
import workforceLocationsSchema from '../fixtures/schemas/workforce-locations';

// Team Schema
import workforceRolesSchema from '../fixtures/schemas/workforce-roles';

// Selected Data Environments
import selectedDataEnvironmentsSchema from '../fixtures/schemas/selected-data-environments';

//Security Control Schemas
import amazonS3SecurityControlsSchema from '../fixtures/schemas/amazon-s3-security-controls';
import applicationSecurityControlsSchema from '../fixtures/schemas/application-security-controls';
import aptibleSecurityControlsSchema from '../fixtures/schemas/aptible-security-controls';
import awsSecurityControlsSchema from '../fixtures/schemas/aws-security-controls';
import googleSecurityControlsSchema from '../fixtures/schemas/google-security-controls';
import gmailSecurityControlsSchema from '../fixtures/schemas/gmail-security-controls';
import securityProceduresSecurityControlsSchema from '../fixtures/schemas/security-procedures-security-controls';
import workforceSecurityControlsSchema from '../fixtures/schemas/workforce-security-controls';
import workstationSecurityControlsSchema from '../fixtures/schemas/workstation-security-controls';

Ember.Test.registerHelper('stubSchemasAPI', function(app, options = {}) {
  // accept an array of handles to exclude.  Useful for individual tests providing
  // their own stubs
  let except = options.except || [];
  let schemas = { workforce_locations: workforceLocationsSchema,
                  workforce_roles: workforceRolesSchema,
                  selected_data_environments: selectedDataEnvironmentsSchema,
                  aptible_security_controls: aptibleSecurityControlsSchema,
                  amazon_s3_security_controls: amazonS3SecurityControlsSchema,
                  workforce_security_controls: workforceSecurityControlsSchema,
                  application_security_controls: applicationSecurityControlsSchema,
                  aws_security_controls: awsSecurityControlsSchema,
                  security_procedures_security_controls: securityProceduresSecurityControlsSchema,
                  google_security_controls: googleSecurityControlsSchema,
                  gmail_security_controls: gmailSecurityControlsSchema,
                  workstation_security_controls: workstationSecurityControlsSchema };

  Ember.keys(schemas).forEach((handle) => {
    if (except.indexOf(handle) === -1) {
      stubRequest('get', `/schemas/${handle}`, function(request) {
        return this.success(schemas[handle]);
      });
    }
  });
});