import Ember from 'ember';

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

  securityControlGroups = securityControlGroups.concat(globalSecurityControlGroups.map((global) => {
    return { handle: global, provider: 'global' };
  }));

  securityControlGroups.push({ handle: 'aptible_security_controls', provider: 'aptible' });

  return securityControlGroups;
}
