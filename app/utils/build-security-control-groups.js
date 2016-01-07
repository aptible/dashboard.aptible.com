import Ember from 'ember';
import Attestation from 'sheriff/models/attestation';
import loadSchema from 'sheriff/utils/load-schema';

export const dataEnvironmentProviderMap = {
  aptible: 'aptible',
  amazonS3: 'aws',
  googleCalendar: 'google',
  googleDrive: 'google',
  gmail: 'google',
  mailgun: 'mailgun'
};

export default function(dataEnvironments, organization, store) {
  let dataEnvironmentNames = dataEnvironments || [];
  let securityControlGroups = [];

  dataEnvironmentNames.without('aptible').forEach((deName) => {
    let deProvider = dataEnvironmentProviderMap[deName];
    let deProviderHandle = `${deProvider}_security_controls`;

    if (deProvider !== deName && !securityControlGroups.findBy('handle', deProviderHandle)) {
      securityControlGroups.push({ handle: deProviderHandle.decamelize(), provider: deProvider });
    }

    securityControlGroups.push({ handle: `${deName.decamelize()}_security_controls`, provider: deProvider });
  });

  securityControlGroups = securityControlGroups.concat([
    { handle: 'application_security_controls', provider: 'global' },
    { handle: 'security_procedures_security_controls', provider: 'global' },
    { handle: 'workforce_security_controls', provider: 'global' },
    { handle: 'workstation_security_controls', provider: 'global' },
    { handle: 'aptible_security_controls', provider: 'aptible' }
  ]);

  securityControlGroups.forEach((securityControlGroup) => {
    securityControlGroup.schema = loadSchema(securityControlGroup.handle).then((schema) => {
      let attestationParams = { handle: securityControlGroup.handle,
                                schemaId: schema.id, organizationUrl: organization, document: {} };
      securityControlGroup.attestation = Attestation.findOrCreate(attestationParams, store);
      securityControlGroup.schema = schema;

      return this;
    });
  });

  return securityControlGroups;
}
