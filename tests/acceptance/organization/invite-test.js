import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var application;
let orgId = 'big-co';
let url = `/organizations/${orgId}/invite`;
let apiRolesUrl = `/organizations/${orgId}/roles`;
let apiInvitationsUrl = `/organizations/${orgId}/invitations`;
let roles = [{
  id: 'role1',
  name: 'owners'
}, {
  id: 'role2',
  name: 'restricted'
}];
let invitations = [];


module('Acceptance: Organizations: Invite Member', {
  beforeEach: function() {
    application = startApp();
    stubOrganization({
      id: orgId,
      _links: {
        roles: { href: apiRolesUrl },
        invitations: { href: apiInvitationsUrl }
      }
    });
    stubRequest('get', apiRolesUrl, function(request){
      return this.success({ _embedded: { roles } });
    });
    stubRequest('get', apiInvitationsUrl, function(request){
      return this.success({ _embedded: { invitations } });
    });
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${url} requires authentication`, function(){
  expectRequiresAuthentication(url);
});

test(`visiting ${url} shows form to invite`, function(assert) {
  assert.expect(6 + roles.length);

  signInAndVisit(url);
  andThen(() => {
    assert.equal(currentPath(), 'dashboard.organization.invite');
    expectFocusedInput('email');
    expectInput('email');
    expectInput('role');
    expectButton('Send Invitation');
    expectButton('Cancel');

    let roleSelect = findInput('role');

    roles.forEach( (role) => {
      assert.ok(roleSelect.find(`option:contains(${role.name})`).length,
                `shows role "${role.name}"`);
    });
  });
});

test(`visiting ${url} and clicking cancel`, function(assert) {
  assert.expect(1);

  signInAndVisit(url);
  clickButton('Cancel');

  andThen(() => {
    assert.equal(currentPath(), 'dashboard.organization.members.index');
  });
});

test(`visiting ${url} and inviting: error`, function(assert){
  assert.expect(2);

  let role = roles[1];
  let roleId   = role.id,
      roleName = role.name,
      email    = 'abc@gmail.com',
      errorMessage = 'Validation failed: Email has already been taken';

  stubRequest('post', `/roles/${roleId}/invitations`, function(request){
    let json = this.json(request);
    return this.error({
      error: 'unprocessable_entity',
      message: errorMessage
    });
  });

  signInAndVisit(url);
  fillInput('email', email);
  fillInput('role', roleId);
  clickButton('Send Invitation');
  andThen(() => {
    let error = find(`:contains(${errorMessage})`);
    assert.ok(error.length, 'error message is shown');

    let email = findInput('email');
    assert.ok(!Ember.isBlank(email.val()), 'email input is still filled');
  });
});
