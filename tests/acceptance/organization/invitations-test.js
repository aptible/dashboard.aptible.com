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
let roleUrl = '/roles/role1';
let invitationsUrl = url;
let invitations = [{
  id: 'invite1',
  email: 'bob@invite1.com',
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
  assert.expect(2 + 2*invitations.length);

  signInAndVisit(url);
  andThen(() => {
    equal(currentPath(), 'organization.invitations');

    invitations.forEach( (i) => {
      assert.ok(find(`:contains(${i.email})`).length,
                `shows invitation email "${i.email}"`);
      assert.ok(find(`:contains(${i.roleName})`).length,
                `shows invitation role "${i.roleName}"`);
    });

    assert.equal(find('a[title*="Resend invitation"]').length,
                 invitations.length,
                 'a refresh button for each invitation');
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
  andThen(() => {
    let resend = findWithAssert('a[title*="Resend invitation"]');
    click(resend);
  });
  andThen(() => {
    assert.ok(find('.alert-success').length,
              'shows success message');
  });
});

// FIXME wire up the delete button and test it here
