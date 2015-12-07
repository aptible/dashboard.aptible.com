import Ember from 'ember';
import Schema from 'ember-json-schema/models/schema';

// Import data environment schema
import dataEnvironmentsSchemaJson from 'sheriff/schemas/data-environments';

// Provider Schemas
import aptibleSchema from 'sheriff/schemas/providers/aptible';
import awsSchema from 'sheriff/schemas/providers/aws';
import googleSchema from 'sheriff/schemas/providers/google';

// Data Environment Schemas
import gmailSchema from 'sheriff/schemas/data-environments/gmail';
import googleCalendarSchema from 'sheriff/schemas/data-environments/google-calendar';
import googleDriveSchema from 'sheriff/schemas/data-environments/google-drive';
import mailgunSchema from 'sheriff/schemas/data-environments/mailgun';
import s3Schema from 'sheriff/schemas/data-environments/s3';

// Global Schemas
import securityProceduresSchema from 'sheriff/schemas/global/security-procedures';
import workforceControlsSchema from 'sheriff/schemas/global/workforce-controls';
import workstationControlsSchema from 'sheriff/schemas/global/workstation-controls';

export var schemaMap = {
  providers: {
    aptible: aptibleSchema,
    aws: awsSchema,
    google: googleSchema
  },

  dataEnvironments: {
    gmail: gmailSchema,
    googleCalendar: googleCalendarSchema,
    googleDrive: googleDriveSchema,
    mailgun: mailgunSchema,
    amazonS3: s3Schema,
  },

  globals: {
    securityProcedures: securityProceduresSchema,
    workforceControls: workforceControlsSchema,
    workstationControls: workstationControlsSchema
  }
};


export function getSecurityControlGroups(dataEnvironments) {
  // Given a collection of data environments, collect DEs by provider, flatten,
  // and map to imported schemas
  let securityControlGroups = [];
  let providers = getSelectedProviders(dataEnvironments);

  providers.forEach((provider) => {
    if(schemaMap.providers[provider]) {
      // If the schema map has a schema for this provider, push that schema
      // Not all data environments have a provider
      securityControlGroups.push({
        schema: schemaMap.providers[provider],
        handle: `provider-${provider}`,
        provider
      });
    }

    // Push all data environments that refer to this provider
    securityControlGroups = securityControlGroups.concat(
      getDataEnvironmentsByProvider(provider, dataEnvironments)
    );
  });

  // Loop over all global schemas and push them
  for(var globalSchema in schemaMap.globals) {
    securityControlGroups.push({ schema: schemaMap.globals[globalSchema], provider: 'global', handle: `global-${globalSchema}` });
  }

  // Push aptible provider schema
  securityControlGroups.push({
    schema: schemaMap.providers.aptible, provider: 'aptible',
    handle: 'provider-aptible'
  });

  return mapAndCreateSchemaDocuments(securityControlGroups);
}

function getDataEnvironmentsByProvider(provider, dataEnvironments) {
  return dataEnvironments.filter((deName) => {
    return getDataEnvironmentProvider(deName) === provider;
  }).map((dataEnvironmentName) => {
    let dataEnvironment = getDataEnvironmentByName(dataEnvironmentName);

    return {
      schema: schemaMap.dataEnvironments[dataEnvironmentName],
      handle: `data-environment-${dataEnvironmentName}`,
      dataEnvironment,
      provider
    };
  });
}

function mapAndCreateSchemaDocuments(controlGroups) {
  return controlGroups.map((controlGroup) => {
    let schema = new Schema(controlGroup.schema);
    let document = schema.buildDocument();
    let dataEnvironment = controlGroup.dataEnvironment || false;
    let title = schema.schema.title;
    let provider = controlGroup.provider;
    let handle = controlGroup.handle;

    return { schema, document, dataEnvironment, title, provider, handle };
  });
}

export function getDataEnvironmentByName(dataEnvironmentName) {
  return Ember.get(dataEnvironmentsSchemaJson.properties,
                   `${dataEnvironmentName}.displayProperties`);
}

export function getDataEnvironmentProvider(dataEnvironmentName) {
  return getDataEnvironmentByName(dataEnvironmentName).provider || false;
}

export function getSelectedProviders(dataEnvironments) {
  // From a set of provided DEs, determine which providers are being used
  let selectedProviders = [];

  dataEnvironments.forEach((deName) => {
    let provider = getDataEnvironmentProvider(deName);
    if (provider) {
      selectedProviders.push(provider);
    }
  });

  return selectedProviders.uniq().without('aptible');
}

export default getSecurityControlGroups;
