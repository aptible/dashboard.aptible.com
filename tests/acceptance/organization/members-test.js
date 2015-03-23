import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import {stubRequest} from 'diesel/tests/helpers/fake-server';

var application;

module('Acceptance: OrganizationMembers', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /organizations/big-co/members', function(assert) {
  assert.expect(4);
  let organizationId = 'big-co';
  let membersUrl = '/organizations/'+organizationId+'/users';

  stubOrganization({
    id: organizationId,
    _links: {
      users: {
        href: membersUrl
      }
    }
  });
  stubRequest('get', membersUrl, function(request){
    assert.ok(true, 'Request for members is made');
    return this.success({
      _embedded: {
        users: [
          {
            id: 'mike',
            name: 'Mike',
            email: 'mike@mike.com',
            _links: {
              roles: {href: '/users/mike/roles'}
            }
          },
          {
            id: 'bob',
            name: 'Bob',
            email: 'bob@bob.com',
            _links: {
              roles: {href: '/users/mike/roles'}
            }
          }
        ]
      }
    });
  });
  stubRequest('get', '/users/bob/roles', function(request){
    return this.success({
      _embedded: {
        roles: []
      }
    });
  });
  stubRequest('get', '/users/mike/roles', function(request){
    return this.success({
      _embedded: {
        roles: []
      }
    });
  });

  signInAndVisit('/organizations/big-co/members');

  andThen(function() {
    assert.equal(currentPath(), 'organization.members');
    assert.ok(find(':contains(Mike)').length, 'Mike is on the page');
    assert.ok(find(':contains(bob@bob.com)').length, 'bob@bob.com is on the page');
  });
});
