import Ember from 'ember';

export const dataEnvironmentProviderMap = {
  aptible: 'aptible',
  amazonS3: 'aws',
  googleCalendar: 'google',
  googleDrive: 'google',
  gmail: 'google',
  mailgun: 'mailgun'

};

export default function(dataEnvironments) {
  let dataEnvironmentNames = Ember.keys(dataEnvironments).filter((deName) => {
    return dataEnvironments[deName];
  });

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

  return securityControlGroups;
}
