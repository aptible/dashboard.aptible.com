import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from '../helpers/start-app'
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref,
         securityOfficerHref } from '../helpers/organization-stub';

let application;
let userId = 'basic-user-1';
let stackId = 'my-stack-1';
let enclaveUrl = `/stacks/${stackId}`;
let gridironAdminUrl = `/gridiron/${orgId}/admin`;
let myGridironUrl = `/gridiron/${orgId}/user`;
let organizationAdminUrl = `/organizations/${orgId}/admin/contact-settings`;
let users = [
  {
    id: userId,
    name: 'Basic User',
    email: 'basicuser@asdf.com',
    _links: {
      self: { href: `/users/${userId}` }
    }
  }
];

function openUserToggle() {
  let dropToggle = findWithAssert('.current-user .dropdown-toggle');
  dropToggle.click();
}

module('Acceptance: Product Dashboard Permissions', {
  beforeEach() {
    application = startApp();
    stubProfile({ hasCompletedSetup: true });
    stubCriterionDocuments({});
    stubCriteria();
    stubStacks();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

function expectCanManageEnclave(assert) {
  visit(enclaveUrl);
  andThen(() => {
    assert.equal(currentPath(), 'dashboard.catch-redirects.stack.apps.index',
                'expectCanManageEnclave: visiting enclave dashboard remains on enclave dashboard');
    assert.equal(find('.sidebar-nav .sidebar-stack-item').length, 2,
                'expectCanManageEnclave: shows both stacks');
    assert.equal(find('.application-nav .enclave-nav').length, 1,
                'expectCanManageEnclave: shows enclave in menu');
  });
}

function expectCanManageGridironAdmin(assert) {
  let expectedEngines = ['risk', 'policy', 'training', 'security'];
  visit(gridironAdminUrl);
  andThen(() => {
    assert.equal(currentPath(), 'gridiron.gridiron-organization.gridiron-admin',
                'expectCanManageGridironAdmin: remain on gridiron admin');
    expectedEngines.forEach((engine) => {
      assert.equal(find(`.${engine}-engine-status`).length, 1,
                  `expectCanManageGridironAdmin: shows ${engine} panel`);
    });
    assert.equal(find('.application-nav .gridiron-nav').length, 1,
                'expectCanManageGridironAdmin: shows gridiron in main menu');
  });

  andThen(openUserToggle);

  andThen(() => {
    let adminLink = find('.dashboard-dropdown-organization-menu .gridiron-admin');
    assert.equal(adminLink.length, 1, 'expectCanManageGridironAdmin: has gridiron admin link');
  });
}

function expectCanManageOrganizationAdmin(assert) {
  visit(organizationAdminUrl);
  andThen(() => {
    assert.equal(currentPath(), 'dashboard.organization.admin.contact-settings',
                'expectCanManageOrganizationAdmin: remains on contact settings page');

    assert.equal(find('.organization-settings .contact-settings').length, 1,
                      'expectCanManageOrganizationAdmin: organization sidebar shows contact settings link');
  });
}

function expectCanManageMyGridiron(assert) {
  visit(myGridironUrl);
  andThen(() => {
    assert.equal(currentPath(), 'gridiron.gridiron-organization.gridiron-user',
                'expectCanManageMyGridiron: remains on gridiron user');
  });

  andThen(openUserToggle);
  andThen(() => {
    assert.equal(find('.dashboard-dropdown-organization-menu .gridiron-user').length, 1,
                'expectCanManageMyGridiron: has my gridiron link in dropdown nav');
  })
}

function expectDenyGridironAdmin(assert) {
  visit(gridironAdminUrl);
  andThen(() => {
    assert.equal(currentPath(), 'gridiron.gridiron-organization.gridiron-user',
                'expectDenyGridironAdmin: redirected to gridiron user');
    assert.equal(find('.danger:contains(Access Denied)').length, 1,
                'expectDenyGridironAdmin: shows access denied error message');
  });

  andThen(openUserToggle);

  andThen(() => {
    let adminLink = find('.dashboard-dropdown-organization-menu .gridiron-admin');
    assert.equal(adminLink.length, 0, 'expectDenyGridironAdmin: has no gridiron admin link');
  });
}

function expectDenyEnclave(assert) {
  visit(stacksUrl);
  andThen(() => {
    // Should be redirected to "My Gridiron" with error message
    assert.equal(currentPath(), 'gridiron.gridiron-organization.gridiron-user',
                'expectDenyEnclave: redirected to "My Compliance" page');
    assert.equal(find('.danger:contains(Access Denied)').length, 1,
                'expectDenyEnclave: shows access denied error message');
    assert.equal(find('.application-nav .enclave-nav').length, 0,
                'expectDenyEnclave: has no link to enclave in main nav');
  });
}

function expectDenyOrganizationAdmin(assert) {
  visit(organizationAdminUrl);
  andThen(() => {
    assert.equal(currentPath(), 'organization.members.index',
                'expectDenyOrganizationAdmin: redirected to organization members index');
  });

  andThen(openUserToggle);

  andThen(() => {
    assert.equal(find('.danger:contains(Access Denied)').length, 1,
                 'expectDenyOrganizationAdmin: shows access denied error');
    assert.equal(find('.dashboard-dropdown-organization-menu .organization-settings').length, 0,
                'expectDenyOrganizationAdmin: has no organization settings link');
    assert.equal(find('.dashboard-dropdown-organization-menu .organization-members').length, 1,
                'expectDenyOrganizationAdmin: has organization members link');
  })
}

test('Users in `Owners` Role', function(assert) {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Manage  | Manage         | Manage      | Manage

  let roles = [
    {
      id: 'owner-1',
      type: 'owners',
      _links: {
        self: { href: '/roles/owner-1' },
        organization: { href: `/organizations/${orgId}` }
      }
    }
  ];

  stubValidOrganization({}, { plan: 'production' });
  signIn({}, roles);

  // Should be able to view/manage Enclave
  expectCanManageEnclave(assert);

  // Should be able to view/manage Gridiron Admin
  expectCanManageGridironAdmin(assert);

  // Should be able to view/manage Organization
  expectCanManageOrganizationAdmin(assert);

  // Should be able to view "My Gridiron"
  expectCanManageMyGridiron(assert);

  assert.ok(true);
});

test('Users ONLY in `Platform Owner` role', function(assert) {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Manage  | Deny           | Manage      | Deny

  let roles = [
    {
      id: 'owner-1',
      type: 'platform_owner',
      _links: {
        self: { href: '/roles/owner-1' },
        organization: { href: `/organizations/${orgId}` }
      }
    }
  ];

  stubValidOrganization({}, { plan: 'production' });
  stubRequests(roles, users);
  signIn({}, roles);

  // Should not be able to view gridiron Admin
  expectDenyGridironAdmin(assert);

  // Should be able to view "My Gridiron"
  expectCanManageMyGridiron(assert);

  // Should be able to view/manage Enclave
  expectCanManageEnclave(assert);

  // Should be able to view/manage Organization
  expectDenyOrganizationAdmin(assert);

  assert.ok(true);
});

test('Users ONLY in `Compliance Owner` role', function(assert) {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Deny    | Manage          | Manage      | Deny

  let roles = [
    {
      id: 'owner-1',
      type: 'owners'
    }
  ];

  stubOrganization({}, { plan: 'production' });
  signIn({}, roles);

  // Should not be able to view Enclave
  expectDenyEnclave(assert);

  // Should be redirected to Gridiron Admin
  expectEnclaveTogridironRedirect(assert);

  // Should be able to view/manage Gridiron Admin
  expectCanManageGridironAdmin(assert);

  // Should be able to view "My Gridiron"
  expectCanManageMyGridiron(assert);

  // Should not be able to view/manage Organization
  expectDenyOrganizationAdmin(assert);

  assert.ok(true);
});

test('Users in `Platform Owner` and `Compliance Owner`', function(assert) {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Manage  | Manage         | Manage      | Deny

  let roles = [
    {
      id: 'owner-1',
      type: 'owners'
    }
  ];

  stubOrganization({}, { plan: 'production' });
  signIn({}, roles);

  // Should be able to view/manage Enclave
  expectCanManageEnclave(assert);

  // Should be able to view/manage Gridiron Admin
  expectCanManageGridironAdmin(assert);

  // Should be able to view "My Gridiron"
  expectCanManageMyGridiron(assert);

  // Should not be able to view/manage Organization
  expectCanManageMyGridiron(assert);

  assert.ok(true);
});

test('Users ONLY in `Platform User` with no stack permissions', function(assert) {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Warn    | Deny           | Manage      | Deny

  let roles = [
    {
      id: 'owner-1',
      type: 'owners'
    }
  ];

  stubOrganization({}, { plan: 'production' });
  signIn({}, roles);

  // Should not be able to view Enclave
  // Should see see error message in Enclave
  expectErrorOnEnclave(assert);

  // Should not be able to view/manage Gridiron Admin
  expectDenyGridironAdmin(assert);

  // Should be able to view "My Gridiron"
  expectCanManageMyGridiron(assert);

  // Should not be able to view/manage Organization
  expectDenyOrganizationAdmin(assert);
  assert.ok(true);
});

test('Users ONLY in `Platform User` with stack permissions', function(assert) {
  // Enclave        | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Manage Partial | Deny           | Manage      | Deny

  let roles = [
    {
      id: 'owner-1',
      type: 'owners'
    }
  ];

  stubOrganization({}, { plan: 'production' });
  signIn({}, roles);

  // Should be able to view/manage Partial Enclave
  // Should only see stacks with read or higher permissions
  // TODO

  // Should not be able to view/manage Gridiron Admin
  expectDenyGridironAdmin(assert);

  // Should be able to view "My Gridiron"
  expectCanManageMyGridiron(assert);

  // Should not be able to view/manage Organization
  expectDenyOrganizationAdmin(assert);

  assert.ok(true);
});

test('Users ONLY in `Compliance User` with no product permissions', function(assert) {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Deny    | Warn           | Manage      | Deny

  let roles = [
    {
      id: 'owner-1',
      type: 'owners'
    }
  ];

  stubOrganization({}, { plan: 'production' });
  signIn({}, roles);

  // Should not be able to view Enclave
  expectDenyEnclave(assert);

  // Should be able to access Gridiron Admin, but with error
  //TODO

  // Should be able to veiw "My Gridiron"
  expectCanManageMyGridiron(assert);

  // Should not be able to view/manage Organization
  expectDenyOrganizationAdmin(assert);
});

test('Users in any role without Gridiron plan', function(assert) {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Deny    | Warn           | Manage      | Deny

  let roles = [
    {
      id: 'owner-1',
      type: 'owners'
    }
  ];

  stubOrganization({}, { plan: 'production' });
  signIn({}, roles);

  // Should not be able to see "My Gridiron"
  expectDenyMyGridiron(assert);
});

skip ('Users in any role without enclave plan', function(assert) {
  // Should not be able to see "Enclave"
  expectCanManageMyGridiron(assert);
});

skip('Users ONLY in `Compliance User` with some product permissions', function(assert) {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Deny    | Manage Partial | Manage      | Deny

  let roles = [
    {
      id: 'owner-1',
      type: 'owners'
    }
  ];

  stubOrganization({}, { plan: 'production' });
  signIn({}, roles);

  // Should not be able to viwe Enclave
  expectDenyEnclave(assert);

  // Should be able to access Gridiron Admin, but limited apps
  // TODO

  // Should be able to view "My Gridiron"
  expectCanManageMyGridiron(assert);

  // Should not be able to view/manage Organization
  expectDenyOrganizationAdmin(assert);
});

function stubRequests(roles = [], users = [], invitations = []) {
  stubRequest('get', rolesHref, function() {
    return this.success({ _embedded: { roles } });
  });

  stubRequest('get', usersHref, function() {
    return this.success({ _embedded: { users }});
  });

  stubRequest('get', invitationsHref, function() {
    return this.success({ _embedded: { invitations: [] }});
  });

  stubRequest('get', securityOfficerHref, function() {
    return this.success(users[0]);
  });
}