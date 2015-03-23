import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import {stubRequest} from 'diesel/tests/helpers/fake-server';

let application;
let orgId = 'o1'; // FIXME this is hardcoded to match the value for signIn in aptible-helpers
let url = `/organizations/${orgId}/invitations`;
let invitationsUrl = url;

module('Acceptance: Organizations: Invitations', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${url} requires authentication`, () => {
  expectRequiresAuthentication(url);
});

test(`visiting ${url} shows pending invites`, (assert) => {
  let roleUrl = '/roles/role1';
  let invitations = [{
    id: 'invite1',
    email: 'bob@invite1.com',
    roleName: 'owners',
    _links: { role: { href: roleUrl } }
  }];

  assert.expect(3 + 2*invitations.length);

  stubOrganization({
    id:orgId,
    _links: { invitations: {href: invitationsUrl} }
  });

  stubRequest('get', invitationsUrl, function(request){
    assert.ok(true, `gets ${invitationsUrl}`);
    return this.success({ _embedded: { invitations } });
  });

  stubRequest('get', roleUrl, function(request){
    assert.ok(true, `gets ${roleUrl}`);
    return this.success({
      id: 'role1',
      name: invitations[0].roleName
    });
  });

  signInAndVisit(url);
  andThen(() => {
    equal(currentPath(), 'organization.invitations');

    invitations.forEach( (i) => {
      assert.ok(find(`:contains(${i.email})`).length,
                `shows invitation email "${i.email}"`);
      assert.ok(find(`:contains(${i.roleName})`).length,
                `shows invitation role "${i.roleName}"`);
    });
  });
});

// FIXME wire up the resend and delete buttons and test them here
