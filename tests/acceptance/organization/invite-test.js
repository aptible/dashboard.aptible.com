import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import {stubRequest} from 'diesel/tests/helpers/fake-server';

var application;
let orgId = 'big-co';
let url = `/organizations/${orgId}/invite`;
let rolesUrl = `/organizations/${orgId}/roles`;
let roles = [{
  id: 'role1',
  name: 'owners'
}, {
  id: 'role2',
  name: 'restricted'
}];


module('Acceptance: Organizations: Invite Member', {
  beforeEach: function() {
    application = startApp();
    stubOrganization({
      id: orgId,
      _links: {
        roles: { href: rolesUrl }
      }
    });
    stubRequest('get', rolesUrl, function(request){
      return this.success({ _embedded: { roles } });
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
    assert.equal(currentPath(), 'organization.invite');
    expectFocusedInput('email');
    expectInput('email');
    expectInput('role');
    expectButton('Invite');
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
    assert.equal(currentPath(), 'organization.members');
  });
});

test(`visiting ${url} and inviting: success`, function(assert){
  assert.expect(7);

  let role = roles[1];
  let roleName = role.name,
      roleId   = role.id,
      email    = 'abc@gmail.com';

  stubRequest('post', `/roles/${roleId}/invitations`, function(request){
    assert.ok(true, `posts to create invitation`);
    let json = this.json(request);

    assert.equal(json.email, email, 'posts email');
    return this.success({});
  });

  signInAndVisit(url);
  andThen(() => {
    assert.ok(findButton('Invite').is(':disabled'),
              'button is disabled with no email or role');
  });
  fillInput('email', email);
  andThen(() => {
    assert.ok(findButton('Invite').is(':disabled'),
              'button is disabled with no role');
  });
  fillInput('role', roleName);
  andThen(() => {
    assert.ok(!findButton('Invite').is(':disabled'),
              'button is enabled with email and role');
  });
  clickButton('Invite');
  andThen(() => {
    let success = find('.alert.alert-success');
    assert.ok(success.length, 'success message is shown');

    let email = findInput('email');
    assert.ok(Ember.isBlank(email.val()), 'email input is blanked');
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
  fillInput('role', roleName);
  clickButton('Invite');
  andThen(() => {
    let error = find(`:contains(${errorMessage})`);
    assert.ok(error.length, 'error message is shown');

    let email = findInput('email');
    assert.ok(!Ember.isBlank(email.val()), 'email input is still filled');
  });
});
