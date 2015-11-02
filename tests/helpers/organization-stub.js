import Ember from 'ember';
import { stubRequest } from 'ember-cli-fake-server';

export var orgId = 'o1';
export var rolesHref = `/organizations/${orgId}/roles`;
export var usersHref = `/organizations/${orgId}/users`;
export var securityOfficerId = 'security-officer-3';
export var securityOfficerHref = `/users/${securityOfficerId}`;

Ember.Test.registerHelper('stubValidOrganization', function(app) {
  let organization = {
    id: orgId,
    name: orgId,
    _links: {
      roles: { href: rolesHref },
      users: { href: usersHref },
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
