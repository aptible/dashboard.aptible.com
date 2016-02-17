import Ember from 'ember';
import { stubRequest } from 'ember-cli-fake-server';

export var orgId = 'o1';
export var rolesHref = `/organizations/${orgId}/roles`;
export var usersHref = `/organizations/${orgId}/users`;
export var invitationsHref = `/organizations/${orgId}/invitations`;
export var securityOfficerId = 'security-officer-3';
export var securityOfficerHref = `/users/${securityOfficerId}`;

Ember.Test.registerHelper('stubValidOrganization', function(app) {
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

  stubRequest('get', `/organizations/${orgId}`, function(request) {
    return this.success(organization);
  });

  stubRequest('get', '/organizations', function(request) {
    return this.success({ _embedded: { organizations: [organization] }});
  });
});

Ember.Test.registerHelper('stubProfile', function(app, profileData) {
  stubRequest('get', `/organization_profiles/${orgId}`, function(request) {
    profileData.id = orgId;
    return this.success(profileData);
  });
});

Ember.Test.registerHelper('clickContinueButton', function(app) {
  let continueButton = findWithAssert('button.top-continue-button:contains(Continue)').first();
  continueButton.click();
});

Ember.Test.registerHelper('stubCurrentAttestations', function(app, attestationPayloads) {
  var attestationId = 0;

  stubRequest('get', '/attestations', function(request) {
    let requestHandle = request.url.replace(/.+handle=(\S+)\&.+/, '$1');
    let attestations = [];

    if (requestHandle && attestationPayloads[requestHandle]) {
      attestations = [{
        id: attestationId++,
        schema_id: `${requestHandle}/1`,
        handle: requestHandle,
        document: attestationPayloads[requestHandle] || {},
        organization_url: `/organizations/${orgId}`
      }];
    }

    return this.success({ _embedded: { attestations } });
  });
});
