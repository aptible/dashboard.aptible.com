import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from '../helpers/start-app';

let application;
let orgId = 1;
let stackId = 'my-stack-1';
let enclaveUrl = `/stacks/${stackId}`;
let gridironAdminUrl = `/gridiron-admin/${orgId}`;
let myGridironUrl = `/gridiron-user/${orgId}`;
let organizationAdminUrl = `/organizations/${orgId}/contact-settings`;

function doSetup() {
  stubOrganizations();
  stubStacks();
}

module('Acceptance: Product Dashboard Permissions', {
  beforeEach() {
    application = startApp();
    doSetup();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

function expectCanManageEnclave(assert) {
  visit(enclaveUrl);
  andThen(() => {
    // Is not redirected
    assert.equal(currentPath(), 'dashboard.catch-redirects.stack.apps.index', 'visiting enclave dashboard remains on enclave dashboard');

    // Sees stacks

    // Sees enclave in top nav
  });
}

function expectCanManagegridironAdmin(assert) {
  visit(gridironAdminUrl);
  andThen(() => {
    // Is not redirected
    // Sees all engines
    // Sees gridiron admin in top nav
  });
}

function expectCanManageOrganizationAdmin(assert) {
  visit(organizationAdminUrl);
  andThen(() => {
    // Can see contact settings page
  });
}

function expectCanManageMyGridiron(assert) {
  visit(myGridironUrl);
  andThen(() => {
    // Can see my gridiron page
    // Can see my status
  });
}

function expectDenyGridironAdmin(assert) {
  visit(gridironAdminUrl);
  andThen(() => {
    // Should be redirected to "My Gridiron" with error message
  });
}

function expectDenyEnclave(assert) {
  visit(stacksUrl);
  andThen(() => {
    // Should be redirected to "My Gridiron" with error message
  })
}

function expectDenyOrganizationAdmin(assert) {
  visit(organizationAdminUrl);
  andThen(() => {
    // Should be redirected to organization members with error message
  });
}

test('Users in `Owners` Role', function(assert) {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Manage  | Manage         | Manage      | Manage
  let roles = [
    {
      id: 'owner-1',
      type: 'owners'
    }
  ];

  signIn({}, roles);

  // Should be able to view/manage Enclave
  andThen(expectCanManageEnclave(assert));

  // Should be able to view/manage Gridiron Admin
  andThen(expectCanManageGridironAdmin(assert));

  // Should be able to view/manage Organization
  andThen(expectCanManageOrganizationAdmin(assert));

  // Should be able to view "My Gridiron"
  andThen(expectCanManageMyGridiron(assert));

  assert.ok(true);
});

test('Users ONLY in `Platform Owner` role', function(assert) {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Manage  | Deny           | Manage      | Deny

  // Should not be able to view gridiron Admin
  andThen(expectDenyGridironAdmin(assert));

  // Should be able to view "My Gridiron"
  andThen(expectCanManageMyGridiron(assert));

  // Should be able to view/manage Enclave
  andThen(expectCanManageEnclave(assert));

  // Should be able to view/manage Organization
  andThen(expectDenyOrganizationAdmin(assert));

  assert.ok(true);
});

test('Users ONLY in `Compliance Owner` role', function(assert) {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Deny    | Manage          | Manage      | Deny

  // Should not be able to view Enclave
  andThen(expectDenyEnclave(assert));

  // Should be redirected to Gridiron Admin
  andThen(expectEnclaveTogridironRedirect(assert));

  // Should be able to view/manage Gridiron Admin
  andThen(expectCanManageGridironAdmin(assert));

  // Should be able to view "My Gridiron"
  andThen(expectCanManageMyGridiron(assert));

  // Should not be able to view/manage Organization
  andThen(expectDenyOrganizationAdmin(assert));

  assert.ok(true);
});

test('Users in `Platform Owner` and `Compliance Owner`', function(assert) {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Manage  | Manage         | Manage      | Deny

  // Should be able to view/manage Enclave
  andThen(expectCanManageEnclave(assert));

  // Should be able to view/manage Gridiron Admin
  andThen(expectCanManageGridironAdmin(assert));

  // Should be able to view "My Gridiron"
  andThen(expectCanManageMyGridiron(assert));

  // Should not be able to view/manage Organization
  andThen(expectCanManageMyGridiron(assert));

  assert.ok(true);
});

test('Users ONLY in `Platform User` with no stack permissions', function(assert) {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Warn    | Deny           | Manage      | Deny


  // Should not be able to view Enclave
  // Should see see error message in Enclave
  andThen(expectErrorOnEnclave(assert));

  // Should not be able to view/manage Gridiron Admin
  andThen(expectDenyGridironAdmin(assert));

  // Should be able to view "My Gridiron"
  andThen(expectCanManageMyGridiron(assert));

  // Should not be able to view/manage Organization
  andThen(expectDenyOrganizationAdmin(assert));
  assert.ok(true);
});

test('Users ONLY in `Platform User` with stack permissions', function(assert) {
  // Enclave        | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Manage Partial | Deny           | Manage      | Deny


  // Should be able to view/manage Partial Enclave
  // Should only see stacks with read or higher permissions
  // TODO

  // Should not be able to view/manage Gridiron Admin
  andThen(expectDenyGridironAdmin(assert));

  // Should be able to view "My Gridiron"
  andThen(expectCanManageMyGridiron(assert));

  // Should not be able to view/manage Organization
  andThen(expectDenyOrganizationAdmin(assert));

  assert.ok(true);
});

test('Users ONLY in `Compliance User` with no product permissions', function(assert) {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Deny    | Warn           | Manage      | Deny

  // Should not be able to view Enclave
  andThen(expectDenyEnclave(assert));

  // Should be able to access Gridiron Admin, but with error
  //TODO

  // Should be able to veiw "My Gridiron"
  andThen(expectCanManageMyGridiron(assert));

  // Should not be able to view/manage Organization
  andThen(expectDenyOrganizationAdmin(assert));
  assert.ok(true);
});

skip('Users ONLY in `Compliance User` with some product permissions', function(assert) {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Deny    | Manage Partial | Manage      | Deny

  // Should not be able to viwe Enclave
  andThen(expectDenyEnclave(assert));

  // Should be able to access Gridiron Admin, but limited apps
  // TODO

  // Should be able to view "My Gridiron"
  andThen(expectCanManageMyGridiron(assert));

  // Should not be able to view/manage Organization
  andThen(expectDenyOrganizationAdmin(assert));
});

