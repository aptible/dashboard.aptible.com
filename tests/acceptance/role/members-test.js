import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let application;
let orgId = '1';
let roleId = 'r1';
let roleMembersUrl = `/roles/${roleId}/memberships`;
let orgUsersUrl = `/organizations/${orgId}/users`;
let pageUrl = `/roles/${roleId}/members`;

const ownerRole = {
  id: roleId,
  type: 'owner',
  name: 'Account Owner',
  _links: {
    organization: { href: `/organizations/${orgId}` },
    memberships: { href: roleMembersUrl }
  }
};

const nonOwnerRole = {
  id: 'role-dbas-1',
  type: 'platform_user',
  name: 'Database Admins',
  _links: {
    organization: { href: `/organizations/${orgId}` },
    memberships: { href: `/roles/role-dbas-1/memberships` }
  }
};

const memberUser = {
  id: 'org-user-1',
  name: 'neo'
};

const deleteThisUser = {
  id: 'org-user-2',
  name: 'Mr. Smith'
};

// User with only one role
const cannotDeleteThis = {
  id: 'org-user-3',
  name: 'Morpheus',
  _embedded: {
    roles: [ nonOwnerRole ]
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

  if (!options.role) {
    options.role = ownerRole;
  }

  stubRequest('get', '/organizations', function() {
    return this.success({
      _links: {},
      _embedded: { organizations: [orgData] }
    });
  });
  stubOrganization(orgData);

  stubRequest('get', `/roles/${options.role.id}`, function() {
    return this.success(options.role || ownerRole);
  });

  stubRequest('get', orgUsersUrl, function(){
    return this.success({ _embedded: { users: options.roleUsers || [] } });
  });

  stubRequest('get', (options.roleMembersUrl || roleMembersUrl), function(){
    return this.success({ _embedded: { memberships: options.roleMembers || [] } });
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
});

test(`visiting ${pageUrl} displays a message for a role with no members`, (assert) => {
  setUp({
    roleUsers: [ memberUser ]
  });
  signIn(null, ownerRole);
  visit(pageUrl);
  andThen(() => {
    assert.ok(find('.empty-row').text().match(/currently has no members/));
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
    let select = $('.role__add-user select');
    let optVal = $('.role__add-user option:last-of-type').val();

    Ember.run(() => {
      select.val(optVal);
      select.trigger('change');
    });

    clickButton('Add');
  });

  andThen(() => {
    findWithAssert('.aptable__member-row');
    assert.equal(find(`.profile--inline:contains(${memberUser.name})`).length,
      1, 'Added user is rendered.');
  });
});

test(`visiting ${pageUrl} role members can be removed by account owners`, (assert) => {
  const member1 = {
    id: 'role-member-1',
    _embedded: {
      role: ownerRole,
      user: deleteThisUser
    }
  };

  setUp({
    roleUsers: [ memberUser ],
    roleMembers: [ member1 ]
  });

  stubRequest('put', `/memberships/${member1.id}`, function() {
    return this.success(member1);
  });
  stubRequest('delete', `/memberships/${member1.id}`, function() {
    return this.success(member1);
  });

  let _confirm = window.confirm;
  window.confirm = () => { return true; };

  signIn(null, ownerRole);
  visit(pageUrl);
  andThen(() => {
    findWithAssert('.aptable__member-row');
    assert.equal(find(`.profile--inline:contains(${deleteThisUser.name})`).length, 1);
    clickButton('Remove');
  });
  andThen(() => {
    assert.ok(find('.empty-row').text().match(/currently has no members/));
    window.confirm = _confirm;
  });
});

test(`visiting ${pageUrl} role members last role cannot be removed`, (assert) => {
  const member1 = {
    id: 'role-member-1',
    _embedded: {
      role: ownerRole,
      user: cannotDeleteThis
    }
  };

  setUp({
    roleUsers: [ memberUser ],
    roleMembers: [ member1 ]
  });

  stubRequest('put', `/memberships/${member1.id}`, function() {
    return this.success(member1);
  });
  stubRequest('delete', `/memberships/${member1.id}`, function() {
    return this.success(member1);
  });

  signIn(null, ownerRole);
  visit(pageUrl);
  andThen(() => {
    findWithAssert('.aptable__member-row');
    assert.equal(find(`.profile--inline:contains(${cannotDeleteThis.name})`).length, 1);
    assert.equal(find(`.btn:contains('Remove')`).length, 0, 'no remove button');
  });
});

test(`role members can be made role admins`, (assert) => {
  cannotDeleteThis._embedded.roles = [nonOwnerRole];

  const member1 = {
    id: 'dbas-role-member-1',
    privileged: false,
    _embedded: {
      role: nonOwnerRole,
      user: cannotDeleteThis
    }
  };

  memberUser._embedded = {
    roles: [ownerRole]
  };

  setUp({
    role: nonOwnerRole,
    roleUsers: [ memberUser ],
    roleMembers: [ member1 ],
    roleMembersUrl: `/roles/${nonOwnerRole.id}/memberships`
  });

  stubRequest('put', `/memberships/${member1.id}`, function(request) {
    let parsed = JSON.parse(request.requestBody);
    assert.equal(parsed.privileged, !member1.privileged, 'Updates on toggle');
    member1.privileged = parsed.privileged;
    return this.success(member1);
  });

  signIn(memberUser, ownerRole);
  visit(`/roles/${nonOwnerRole.id}/members`);

  andThen(() => {
    assert.equal(member1.privileged, false, 'member is not privileged');
    findWithAssert('.x-toggle-btn').click();
  });
  andThen(() => {
    assert.equal(member1.privileged, true, 'member is updated to privileged');
  });
});

test(`visiting ${pageUrl} as an unauthorized user to roles does not redirect, but hides membership edit`, (assert) => {
  cannotDeleteThis._embedded.roles = [nonOwnerRole];

  const member1 = {
    id: 'dbas-role-member-1',
    privileged: false,
    _embedded: {
      role: nonOwnerRole,
      user: cannotDeleteThis
    }
  };

  memberUser._embedded = {
    roles: [ownerRole]
  };

  setUp({
    role: nonOwnerRole,
    roleUsers: [ memberUser ],
    roleMembers: [ member1 ],
    roleMembersUrl: `/roles/${nonOwnerRole.id}/memberships`
  });

  signIn(cannotDeleteThis, nonOwnerRole);
  visit(`/roles/${nonOwnerRole.id}/members`);
  andThen(() => {
    assert.equal(
      currentPath(),
      'requires-authorization.enclave.role.members',
      'remains on current path'
    );

    assert.equal(find('.invite-new-members-to-role').length, 0, 'does not show invite members UI');
  });
});
