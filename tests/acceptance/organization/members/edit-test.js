import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { stubRequest } from 'diesel/tests/helpers/fake-server';

let application;
let orgId = 'big-co';
let orgName = 'big company';
let roles = [{
  id: 'r1',
  name: 'owners',
  _links: {
    memberships: { href: `/roles/r1/memberships` },
    organization: { href: `/organizations/${orgId}` }
  }
}, {
  id: 'r2',
  name: 'external',
  _links: {
    memberships: { href: `/roles/r2/memberships` }
  }
}];
let userId = 'user-25';
let apiUserUrl = `/users/${userId}`;
let membershipId = 'm1';
let memberships = [{
  id: membershipId,
  _links: { user: { href: apiUserUrl } }
}];

let userRoles = [roles[0]];

let apiMemberUrl = `/users/${userId}`;
let apiRolesUrl = `/organizations/${orgId}/roles`;
let apiUserRolesUrl = `/users/${userId}/roles`;
let url = `/organizations/${orgId}/members/${userId}/edit`;

let user = {
  id: userId,
  name: 'Bob LastName',
  email: 'bob@lastname.com',
  _links: {
    roles: { href: apiUserRolesUrl },
    self: { href: apiUserUrl }
  }
};

module('Acceptance: Organization Members: Member', {
  beforeEach: function() {
    application = startApp();
    stubOrganization({
      id: orgId,
      name: orgName,
      _links: {
        roles: { href: apiRolesUrl }
      }
    });

    stubRequest('get', apiMemberUrl, function(){
      return this.success(user);
    });

    // all org roles
    stubRequest('get', apiRolesUrl, function(){
      return this.success({ _embedded: { roles } });
    });

    // this user's roles
    stubRequest('get', apiUserRolesUrl, function(){
      return this.success({ _embedded: { roles: userRoles } });
    });
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${url} requires authentication`, function() {
  expectRequiresAuthentication(url);
});

test(`visiting ${url} shows user's info and all roles with checkboxes`, function(assert) {
  assert.expect(5 + 3*roles.length);

  signInAndVisit(url);

  andThen(function() {
    assert.equal(currentPath(), 'dashboard.organization.members.edit');
    assert.ok(find(`:contains(${user.name})`).length, `user name "${user.name} is on the page`);
    assert.ok(find(`:contains(${user.name})`).length, `user email "${user.email} is on the page`);

    expectButton('Save');
    expectButton(`Remove from ${orgName}`);

    roles.forEach((role, index) => {
      let roleDiv = find(`.role:eq(${index})`);

      assert.ok(roleDiv.text().indexOf(role.name) > -1,
                `has role name "${role.name}"`);

      let input = findInput('user-role', {context:roleDiv});
      assert.ok(input.length, `finds a checkbox for role "${role.name}"`);

      let isChecked = userRoles.indexOf(role) > -1;
      if (isChecked) {
        assert.ok(input.is(':checked'),
                  `input for role "${role.name}" is checked`);
      } else {
        assert.ok(!input.is(':checked'),
                  `input for role "${role.name}" is not checked`);
      }
    });
  });
});

test(`visiting ${url} does not show "Remove user" button if the user is looking at their own page`, function() {
  signInAndVisit(url, user);

  andThen(function() {
    expectNoButton(`Remove ${user.name}`);
  });
});

test(`visiting ${url} allows changing user's roles`, function(assert){
  assert.expect(4);

  stubRequest('post', `/roles/${roles[1].id}/memberships`, function(request){
    assert.ok(true, 'posts to correct url');
    assert.equal(this.json(request).user_url, apiUserUrl,
                 `includes user url "${apiUserUrl}" parameter`);
    return this.noContent();
  });

  stubRequest('get', `/roles/${roles[0].id}/memberships`, function(){
    assert.ok(true, 'gets role memberships');
    return this.success({ _embedded: { memberships } });
  });

  stubRequest('delete', `/memberships/${membershipId}`, function(){
    assert.ok(true, `deletes membership id ${membershipId}`);
    return this.noContent();
  });

  let firstRole, secondRole, firstInput, secondInput;

  signInAndVisit(url);
  andThen(() => {
    firstRole = findWithAssert(`.role:eq(0)`);
    secondRole = findWithAssert(`.role:eq(1)`);
    firstInput = findInput('user-role', {context:firstRole});
    secondInput = findInput('user-role', {context:secondRole});
    click(secondInput);  // -> checked,  create this membership
    click(firstInput);  // -> unchecked, delete this membership
  });
  andThen(() => {
    clickButton('Save');
  });
});

test(`visiting ${url} with only 1 role checked is disabled`, function(assert){
  assert.expect(6);

  let firstRole, secondRole, firstInput, secondInput;

  signInAndVisit(url);
  andThen(() => {
    firstRole = findWithAssert(`.role:eq(0)`);
    secondRole = findWithAssert(`.role:eq(1)`);
    firstInput = findInput('user-role', {context:firstRole});
    secondInput = findInput('user-role', {context:secondRole});

    assert.ok(firstInput.is(':disabled'), 'precond - only checked input is disabled');
    assert.ok(!secondInput.is(':disabled'), 'precond - second, unchecked input not disabled');

    click(secondInput);  // -> checked,  create this membership
  });
  andThen(() => {
    assert.ok(!firstInput.is(':disabled'), 'first input is no longer disabled');
    assert.ok(!secondInput.is(':disabled'), 'second input still not disabled');

    click(firstInput);  // -> unchecked, now only the 2nd input is checked
  });
  andThen(() => {
    assert.ok(!firstInput.is(':disabled'), 'first input is not disabled');
    assert.ok(secondInput.is(':disabled'), 'second input is disabled because it is the only one checked');
  });
});

test(`visit ${url} allows removing user from organization`, function(assert){
  assert.expect(2);

  stubRequest('delete', `/organizations/${orgId}/users/${userId}`, function(){
    assert.ok(true, 'deletes to correct url');
    return this.noContent();
  });
  signInAndVisit(url);
  clickButton(`Remove from ${orgName}`);
  andThen(() => {
    assert.equal(currentPath(), 'dashboard.organization.members.index');
  });
});
