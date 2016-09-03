import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var application;
// MUST match the stubbed organization role for this user in `signIn` helper
// so that the user can manage this organization
let orgId = 1;
let url = `/organizations/${orgId}/members`;
let membersUrl = `/organizations/${orgId}/users`;

module('Acceptance: Organization Members', {
  beforeEach: function() {
    application = startApp();
    stubStacks();
    stubRequest('get', '/organizations', function(){
      return this.success({
        _links: {},
        _embedded: {
          organizations: [{
            _links: {
              users: { href: membersUrl },
              self: { href: `/organizations/${orgId}` }
            },
            id: orgId,
            name: 'Sprocket Co',
            type: 'organization'
          }]
        }
      });
    });
    stubOrganization({
      id: orgId,
      _links: {
        users: { href: membersUrl },
        self: { href: `/organizations/${orgId}` }
      }
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
    verified: true,
    email: 'bob@bob.com',
    otpEnabled: true,
    _links: { roles: {href: '/users/bob/roles'} }
  }];

  let roleData = {
    type: 'owner',
    _links: {
      self: { href: `/roles/r1` },
      organization: { href: `/organizations/${orgId}` }
    }
  };

  stubRequest('get', membersUrl, function() {
    return this.success(users);
  });

  assert.expect(6 + 2*users.length);

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

  signInAndVisit(url, {}, roleData);

  andThen(function() {
    assert.equal(currentPath(), 'requires-authorization.organization.members.index');
    assert.ok(find(':contains(Mike)').length, 'Mike is on the page');
    assert.ok(find(':contains(bob@bob.com)').length, 'bob@bob.com is on the page');
    expectLink(`/organizations/${orgId}/invite`);
    users.forEach((user) => {
      expectLink(`/organizations/${orgId}/members/${user.id}`);
    });

    assert.ok(find('.aptable__member-row .aptable__actions .btn').length,
                   'Edit action is rendered for stubbed user.');
    assert.ok(find('.aptable__member-row:contains(Mike):contains(Disabled)').length,
                   '2FA status disabled is shown for Mike');
    assert.ok(find('.aptable__member-row:contains(Bob):contains(Enabled)').length,
                   '2FA status enabled is shown for Bob');
  });
});
