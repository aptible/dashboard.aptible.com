import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var application;
// MUST match the stubbed organization role for this user in `signIn` helper
// so that the user can manage this organization
let orgId = 'o1';
let url = `/organizations/${orgId}/members`;
let membersUrl = `/organizations/${orgId}/users`;

module('Acceptance: OrganizationMembers', {
  beforeEach: function() {
    application = startApp();
    stubStacks();
    stubOrganizations();
    stubOrganization({
      id: orgId,
      _links: { users: { href: membersUrl } }
    });

  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${url} requires authentication`, function() {
  expectRequiresAuthentication(url);
});

test(`visiting ${url} shows users`, function(assert) {
  let users = [{
    id: 'mike',
    name: 'Mike',
    email: 'mike@mike.com',
    _links: { roles: {href: '/users/mike/roles'} }
  },{
    id: 'bob',
    name: 'Bob',
    email: 'bob@bob.com',
    _links: { roles: {href: '/users/bob/roles'} }
  }];

  assert.expect(5 + 1*users.length);

  stubRequest('get', membersUrl, function(){
    assert.ok(true, 'Request for members is made');
    return this.success({ _embedded: { users } });
  });

  stubRequest('get', '/users/bob/roles', function(){
    return this.success({ _embedded: { roles: [] } });
  });

  stubRequest('get', '/users/mike/roles', function(){
    return this.success({ _embedded: { roles: [] } });
  });

  signInAndVisit(url);

  andThen(function() {
    assert.equal(currentPath(), 'dashboard.organization.members.index');
    assert.ok(find(':contains(Mike)').length, 'Mike is on the page');
    assert.ok(find(':contains(bob@bob.com)').length, 'bob@bob.com is on the page');
    expectLink(`/organizations/${orgId}/invite`);
    users.forEach((user) => {
      expectLink(`/organizations/${orgId}/members/${user.id}`);
    });
  });
});
