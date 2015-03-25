import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import {stubRequest} from 'diesel/tests/helpers/fake-server';

var application;
let orgId = 'big-co';
let url = `/organizations/${orgId}/members`;
let membersUrl = `/organizations/${orgId}/users`;

module('Acceptance: OrganizationMembers', {
  beforeEach: function() {
    application = startApp();
    stubOrganization({
      id: orgId,
      _links: { users: { href: membersUrl } }
    });

  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${url} requires authentication`, function(){
  expectRequiresAuthentication(url);
});

test(`visiting ${url} shows users`, function(assert) {
  assert.expect(5);

  stubRequest('get', membersUrl, function(request){
    assert.ok(true, 'Request for members is made');
    return this.success({
      _embedded: {
        users: [{
          id: 'mike',
          name: 'Mike',
          email: 'mike@mike.com',
          _links: { roles: {href: '/users/mike/roles'} }
        }, {
          id: 'bob',
          name: 'Bob',
          email: 'bob@bob.com',
          _links: { roles: {href: '/users/mike/roles'} }
        }]
      }
    });
  });

  stubRequest('get', '/users/bob/roles', function(request){
    return this.success({ _embedded: { roles: [] } });
  });

  stubRequest('get', '/users/mike/roles', function(request){
    return this.success({ _embedded: { roles: [] } });
  });

  signInAndVisit(url);

  andThen(function() {
    assert.equal(currentPath(), 'organization.members');
    assert.ok(find(':contains(Mike)').length, 'Mike is on the page');
    assert.ok(find(':contains(bob@bob.com)').length, 'bob@bob.com is on the page');
    expectLink(`/organizations/${orgId}/invite`);
  });
});
