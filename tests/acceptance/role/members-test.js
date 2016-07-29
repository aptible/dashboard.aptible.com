import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let application;
let orgId = '1';
let roleId = 'r1';
let roleMembersUrl = `/roles/${roleId}/memberships`;
let orgUsersUrl = `/organizations/${orgId}/users`;
let pageUrl = `/roles/${roleId}/members`;

const memberUser = {
  id: 'org-user-1',
  name: 'neo'
};

const ownerRole = {
  id: roleId,
  type: 'owner',
  name: 'Account Owner',
  _links: {
    organization: { href: `/organizations/${orgId}` }
  }
};

let setUp = function(options) {
  let orgData = {
    id: orgId,
    name: 'Aptible, Inc.',
    _links: {
      self: { href: `/organizations/${orgId}` },
      users: { href: orgUsersUrl }
    }
  };

  stubRequest('get', '/organizations', function() {
    return this.success({
      _links: {},
      _embedded: { organizations: [orgData] }
    });
  });
  stubOrganization(orgData);

  stubRequest('get', `/roles/${roleId}`, function() {
    return this.success(options.role || ownerRole);
  });

  stubRequest('get', orgUsersUrl, function(){
    return this.success({ _embedded: { users: options.roleUsers || [] } });
  });

  stubRequest('get', roleMembersUrl, function(){
    return this.success({ _embedded: { members: options.roleMembers || [] } });
  });
};

module('Acceptance: Role Members', {
  beforeEach: function() {
    application = startApp();
    stubStacks();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${pageUrl} requires authentication`, () => {
  expectRequiresAuthentication(pageUrl);
})  ;

test(`visiting ${pageUrl} displays a message for a role with no members`, (assert) => {
  setUp({
    roleUsers: [ memberUser ],
  });
  signIn(null, ownerRole);
  visit(pageUrl);
  andThen(() => {
    assert.ok(find('.aptable--empty').text().match(/currently has no members/));
  });
});

test(`visiting ${pageUrl} role members can be added by account owners`, (assert) => {
  setUp({
    roleUsers: [ memberUser ],
    roleMembers: []
  });

  stubRequest('post', roleMembersUrl, function() { return this.success({}); });
  stubRequest('put', '/memberships', function() { return this.success({}); });

  signIn(null, ownerRole);
  visit(pageUrl);
  andThen(() => {
    findWithAssert('.aptable--empty');
    let select = $('.role__add-user select');
    let optVal = $('.role__add-user option:last-of-type').val();
    Ember.run(() => {
      select.val(optVal);
      select.trigger('change');
    });
    clickButton('Add');
  });
  andThen(() => {
    Ember.run(() => {
      findWithAssert('.aptable__member-row');
      assert.equal(find(`.profile--inline:contains(${memberUser.name})`).length,
        1, 'Added user is rendered.');
    });
  });
});

// TODO:
//  - admin member toggle
//  - remove
