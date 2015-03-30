import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import {stubRequest} from 'diesel/tests/helpers/fake-server';

let application;
let orgId = 'o1'; // FIXME this is hardcoded to match the value for signIn in aptible-helpers
let url = `/organizations/${orgId}/members`;
let roleUrl = '/roles/role1';
let invitationsUrl = url;
let invitations = [{
  id: 'invite1',
  email: 'bob@invite1.com',
  roleName: 'owners',
  _links: { role: { href: roleUrl } }
}, {
  id: 'invite2',
  email: 'bob2@invite1.com',
  roleName: 'owners',
  _links: { role: { href: roleUrl } }
}];

module('Acceptance: Organizations: Invitations', {
  beforeEach: function() {
    application = startApp();
    stubOrganization({
      id:orgId,
      _links: { invitations: {href: invitationsUrl} }
    });
    stubRequest('get', invitationsUrl, function(request){
      return this.success({ _embedded: { invitations } });
    });
    stubRequest('get', roleUrl, function(request){
      return this.success({
        id: 'role1',
        name: invitations[0].roleName
      });
    });
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${url} requires authentication`, () => {
  expectRequiresAuthentication(url);
});

test(`visiting ${url} shows pending invites`, (assert) => {
  assert.expect(3 + 2*invitations.length);

  signInAndVisit(url);
  andThen(() => {
    equal(currentPath(), 'organization.members.index');

    invitations.forEach( (i) => {
      assert.ok(find(`:contains(${i.email})`).length,
                `shows invitation email "${i.email}"`);
      assert.ok(find(`:contains(${i.roleName})`).length,
                `shows invitation role "${i.roleName}"`);
    });

    assert.equal(find('a[title*="Resend invitation"]').length,
                 invitations.length,
                 'a refresh button for each invitation');

    assert.equal(find('a[title*="Delete invitation"]').length,
                 invitations.length,
                 'a delete button for each invitation');
  });
});

test(`visiting ${url} and clicking "refresh" sends the invite again`, (assert) => {
  assert.expect(3);
  let invitationId = invitations[0].id;

  stubRequest('post', `/resets`, function(request){
    assert.ok(true, 'posts to reset invitation');
    let json = this.json(request);
    assert.equal(json.invitation_id, invitationId);
    return this.success({});
  });

  signInAndVisit(url);
  click('a[title*="Resend invitation"]:eq(0)');
  andThen(() => {
    assert.ok(find('.alert-success').length,
              'shows success message');
  });
});

test(`visiting ${url} and clicking "destroy" destroys the invite`, (assert) => {
  assert.expect(7);

  // called for each deleted invitation (2x)
  stubRequest('delete', `/invitations/:invite_id`, function(request){
    assert.ok(true, 'deletes the invitation');
    return this.success(204, {});
  });

  signInAndVisit(url);
  andThen(() => {
    assert.ok(find(`:contains(${invitations[0].email})`).length,
              'precond - shows invitation email');
  });
  click('a[title*="Delete invitation"]:eq(0)');
  andThen(() => {
    assert.ok(find(`:contains(${invitations[0].email})`).length,
              'no longer shows invitation email');

    assert.ok(find('.alert-success').length,
              'shows success message');
    click('.alert-success .bs-alert-dismiss');
  });
  andThen(() => {
    assert.ok(!find('.alert-success').length,
              'hides success message');
    click('a[title*="Delete invitation"]:eq(0)');
  });
  andThen(() => {
    assert.ok(find('.alert-success').length,
              'shows success message again');
  });
});
