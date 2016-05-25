import Ember from 'ember';
import { stubRequest } from 'ember-cli-fake-server';

export var orgId = 'o1';
export var rolesHref = `/organizations/${orgId}/roles`;
export var usersHref = `/organizations/${orgId}/users`;
export var invitationsHref = `/organizations/${orgId}/invitations`;
export var securityOfficerId = 'security-officer-3';
export var securityOfficerHref = `/users/${securityOfficerId}`;

Ember.Test.registerHelper('stubValidOrganization', function() {
  let organization = {
    id: orgId,
    name: orgId,
    _links: {
      roles: { href: rolesHref },
      users: { href: usersHref },
      invitations: { href: invitationsHref },
      security_officer: { href: `/users/${securityOfficerId}` },
      self: { href: `/organizations/${orgId}` }
    }
  };

  stubRequest('get', `/organizations/${orgId}`, function() {
    return this.success(organization);
  });

  stubRequest('get', '/organizations', function() {
    return this.success({ _embedded: { organizations: [organization] }});
  });
});

Ember.Test.registerHelper('stubProfile', function(_app, profileData) {
  stubRequest('get', `/organization_profiles/${orgId}`, function() {
    profileData.id = orgId;
    return this.success(profileData);
  });
});

Ember.Test.registerHelper('clickContinueButton', function() {
  let continueButton = findWithAssert('button.spd-nav-continue').first();
  continueButton.click();
});


Ember.Test.registerHelper('clickBackButton', function() {
  let continueButton = findWithAssert('button.spd-nav-back').first();
  continueButton.click();
});

Ember.Test.registerHelper('stubCurrentAttestations', function(_app, attestationPayloads) {
  var attestationId = 0;

  stubRequest('get', `/organization_profiles/${orgId}/attestations`, function(request) {
    let requestHandle = request.url.replace(/.+handle=(\S+)/, '$1');
    let attestations = [];

    if (requestHandle && attestationPayloads[requestHandle]) {
      attestations = [{
        id: attestationId++,
        schema_id: `${requestHandle}/1`,
        handle: requestHandle,
        document: attestationPayloads[requestHandle] || {},
        _links: {
          self: { href: `/attestations/${attestationId}` },
          organization_profile: { href: `/organization_profiles/${orgId}` }
        }
      }];
    }

    return this.success({ _embedded: { attestations } });
  });
});
