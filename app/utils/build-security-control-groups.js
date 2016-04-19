import Ember from 'ember';
import loadSchema from 'sheriff/utils/load-schema';
import Attestation from 'sheriff/models/attestation';

export const dataEnvironmentProviderMap = {
  aptible: 'aptible',
  amazonS3: 'aws',
  googleCalendar: 'google',
  googleDrive: 'google',
  gmail: 'google',
  mailgun: 'mailgun'
};

export const globalSecurityControlGroups = [
  'application_security_controls', 'email_security_controls',
  'security_procedures_security_controls', 'workforce_security_controls',
  'workstation_security_controls'];

export default function(dataEnvironments, organization, store) {
  let organizationUrl = organization.get('data.links.self');
  let dataEnvironmentNames = Ember.keys(dataEnvironments).filter((deName) => {
    return dataEnvironments[deName];
  }).sort();

  let securityControlGroups = [];

  dataEnvironmentNames.without('aptible').forEach((deName) => {
    let deProvider = dataEnvironmentProviderMap[deName];
    let deProviderHandle = `${deProvider}_security_controls`;

    if (deProvider !== deName && !securityControlGroups.findBy('handle', deProviderHandle)) {
      securityControlGroups.push({ handle: deProviderHandle.decamelize(),
                                   provider: deProvider,
                                   type: 'data-environment' });
    }

    securityControlGroups.push({
      handle: `${deName.decamelize()}_security_controls`, provider: deProvider,
      type: 'data-environment'
    });
  });

  securityControlGroups.push({ handle: 'aptible_security_controls',
                               provider: 'aptible', type: 'data-environment' });

  securityControlGroups = securityControlGroups.concat(globalSecurityControlGroups.map((global) => {
    return { handle: global, provider: 'organization', type: 'organization' };
  }));

  return securityControlGroups.map((securityControlGroup, index) => {
    securityControlGroup.step = index+1;
    Ember.setProperties(securityControlGroup, {
      step: index+1,
      isLoading: true,
      organization
    });
    return loadSchemaAndAttestation(securityControlGroup, organizationUrl, store);
  });
}

function loadSchemaAndAttestation(securityControlGroup, organizationUrl, store) {
  securityControlGroup.attestation = new Ember.RSVP.Promise((resolve) => {
    securityControlGroup.schema = loadSchema(securityControlGroup.handle);
    securityControlGroup.schema.then((schema) => {
      Ember.set(securityControlGroup, 'schema', schema);
      let attestationParams = { handle: securityControlGroup.handle,
                              schemaId: schema.id, organizationUrl, document: {} };
      let loadAttestation =  Attestation
                               .findOrCreate(attestationParams, store)
                               .then((attestation) => {
                                  resolve(attestation);
                                  onAttestationLoad(attestation, securityControlGroup);
                                });
      Ember.set(securityControlGroup, 'attestation', loadAttestation);
    });
  });

  return securityControlGroup;
}

function onAttestationLoad(attestation, securityControlGroup) {
  if(!attestation.get('isLoaded')) {
    return;
  }

  let { schema } = securityControlGroup;
  let schemaDocument = schema.buildDocument();
  let completed = !attestation.get('isNew');

  if(schema.id === attestation.get('schemaId')) {
    schemaDocument.load(attestation.get('document'));
  }

  attestation.set('schemaId', schema.id);
  Ember.setProperties(securityControlGroup, { attestation, schemaDocument, completed, isLoading: false });
}