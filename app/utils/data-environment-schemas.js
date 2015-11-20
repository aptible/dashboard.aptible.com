import Schema from 'ember-json-schema/models/schema';

// For now, just import schemas statically and map the selected DEs and providers
// When Gridiron is able to serve schemas, this will be replaced with API calls
// to load previous step's selections

import aptibleSchema from 'sheriff/schemas/providers/aptible';
import awsSchema from 'sheriff/schemas/providers/aws';
import googleSchema from 'sheriff/schemas/providers/google';
import ebsSchema from 'sheriff/schemas/data-environments/ebs';
import ec2Schema from 'sheriff/schemas/data-environments/ec2';
import elbSchema from 'sheriff/schemas/data-environments/elb';
import glacierSchema from 'sheriff/schemas/data-environments/glacier';
import gmailSchema from 'sheriff/schemas/data-environments/gmail';
import googleCalendarSchema from 'sheriff/schemas/data-environments/google-calendar';
import googleDriveSchema from 'sheriff/schemas/data-environments/google-drive';
import googleVaultSchema from 'sheriff/schemas/data-environments/vault';
import laptopsSchema from 'sheriff/schemas/data-environments/laptops';
import onPremiseSchema from 'sheriff/schemas/data-environments/on-premise';
import paperSchema from 'sheriff/schemas/data-environments/paper';
import phoneSchema from 'sheriff/schemas/data-environments/phone';
import redshiftSchema from 'sheriff/schemas/data-environments/redshift';
import s3Schema from 'sheriff/schemas/data-environments/s3';
import usbSchema from 'sheriff/schemas/data-environments/usb';
import workstationsSchema from 'sheriff/schemas/data-environments/workstations';
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
    ebs: ebsSchema,
    ec2: ec2Schema,
    elb: elbSchema,
    glacier: glacierSchema,
    gmail: gmailSchema,
    'google-calendar': googleCalendarSchema,
    'google-drive': googleDriveSchema,
    'google-vault': googleVaultSchema,
    laptops: laptopsSchema,
    'on-premise': onPremiseSchema,
    paper: paperSchema,
    phone: phoneSchema,
    redshift: redshiftSchema,
    s3: s3Schema,
    usb: usbSchema,
    workstations: workstationsSchema
  },

  globals: {
    securityProcedures: securityProceduresSchema,
    workforceControls: workforceControlsSchema,
    workstationControls: workstationControlsSchema
  }
};

export function selectedProviders(dataEnvironments) {
  // From a set of provided DEs, determine which providers are being used
  return dataEnvironments
         .filter((d) => d.provider)
         .map((d) => d.provider)
         .uniq()
         .without('aptible');
}

export function getSecurityControlGroups(dataEnvironments) {
  // Given a collection of data environments, collect DEs by provider, flatten,
  // and map to imported schemas
  let securityControlGroups = [];
  let providers = selectedProviders(dataEnvironments);

  providers.forEach((provider) => {
    securityControlGroups.push({ schema: schemaMap.providers[provider], provider, handle: `provider-${provider}` });
    securityControlGroups = securityControlGroups.concat(getDataEnvironmentsByProvider(provider, dataEnvironments));
  });

  securityControlGroups.push({ schema: schemaMap.providers.aptible, provider: 'aptible', handle: 'provider-aptible' });

  // Push all globals schemas
  for(var globalSchema in schemaMap.globals) {
    securityControlGroups.push({ schema: schemaMap.globals[globalSchema], provider: 'global', handle: `global-${globalSchema}` });
  }

  return mapAndCreateSchemaDocuments(securityControlGroups);
}

function getDataEnvironmentsByProvider(provider, dataEnvironments) {
  return dataEnvironments.filter((de) => {
    return de.provider === provider;
  }).map((dataEnvironment) => {
    return {
      schema: schemaMap.dataEnvironments[dataEnvironment.handle],
      handle: `data-environment-${dataEnvironment.handle}`,
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

export default getSecurityControlGroups;
