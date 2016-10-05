import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, usersHref, invitationsHref,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let userId = 'user1';
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

module('Acceptance: Product Authorization Checks', {
  beforeEach() {
    application = startApp();
    stubProfile({ hasCompletedSetup: true });
    stubCriterionDocuments({});
    stubCriteria();
    stubStacks();
    stubRequest('get', '/documents', function() {
      return this.success({ _embedded: { documents: [] }});
    });
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('Users in `Owners` Role', function() {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Manage  | Manage         | Manage      | Manage

  stubValidOrganization({}, { plan: 'production' });
  stubRequests();
  signInAs('owner');

  // Should be able to view/manage Enclave
  expectCanManageEnclave(enclaveUrl);

  // Should be able to view/manage Gridiron Admin
  expectCanManageGridironAdmin(gridironAdminUrl);

  // Should be able to view/manage Organization
  expectCanManageOrganizationAdmin(organizationAdminUrl);

  // Should be able to view "My Gridiron"
  expectCanManageMyGridiron(myGridironUrl);
});

test('Users ONLY in `Platform Owner` role', function() {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Manage  | Deny           | Manage      | Deny

  stubValidOrganization({}, { plan: 'production' });
  stubRequests();
  signInAs('platform_owner');

  // Should not be able to view gridiron Admin
  expectDenyGridironAdmin(gridironAdminUrl);

  // Should be able to view/manage Enclave
  expectCanManageEnclave(enclaveUrl);

  // Should be able to view/manage Organization
  expectDenyOrganizationAdmin(organizationAdminUrl);

  // Should be able to view "My Gridiron"
  expectCanManageMyGridiron(myGridironUrl);
});

test('Users ONLY in `Compliance Owner` role', function() {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Deny    | Manage          | Manage      | Deny

  stubValidOrganization({}, { plan: 'production' });
  stubRequests();
  signInAs('compliance_owner');

  // Should not be able to view Enclave
  // Should be redirected to Gridiron Admin
  expectEnclaveToGridironAdminRedirect(enclaveUrl);

  // Should be able to view/manage Gridiron Admin
  expectCanManageGridironAdmin(gridironAdminUrl);

  // Should not be able to view/manage Organization
  expectDenyOrganizationAdmin(organizationAdminUrl);

  // Should be able to view "My Gridiron"
  expectCanManageMyGridiron(myGridironUrl);
});

test('Users in `Platform Owner` and `Compliance Owner`', function() {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Manage  | Manage         | Manage      | Deny

  stubValidOrganization({}, { plan: 'production' });
  stubRequests();
  signInAs(['compliance_owner', 'platform_owner']);

  // Should be able to view/manage Enclave
  expectCanManageEnclave(enclaveUrl);

  // Should be able to view/manage Gridiron Admin
  expectCanManageGridironAdmin(gridironAdminUrl);

  // Should be able to view "My Gridiron"
  expectCanManageMyGridiron(myGridironUrl);
});

test('Users ONLY in `Platform User` with no stack permissions', function() {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Warn    | Deny           | Manage      | Deny

  stubValidOrganization({}, { plan: 'production' });
  stubRequests();
  signInAs('platform_user');

  // Should not be able to view Enclave
  // Should see see error message in Enclave
  expectErrorOnEnclave(enclaveUrl);

  // Should not be able to view/manage Gridiron Admin
  expectDenyGridironAdmin(gridironAdminUrl);

  // Should not be able to view/manage Organization
  expectDenyOrganizationAdmin(organizationAdminUrl);

  // Should be able to view "My Gridiron"
  expectCanManageMyGridiron(myGridironUrl);
});

test('Users ONLY in `Platform User` with stack permissions', function() {
  // Enclave        | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Manage Partial | Deny           | Manage      | Deny

  stubValidOrganization({}, { plan: 'production' });
  stubRequests();
  signInAs('platform_user');

  // Should be able to view/manage Partial Enclave
  // Should only see stacks with read or higher permissions
  // TODO

  // Should not be able to view/manage Gridiron Admin
  expectDenyGridironAdmin(gridironAdminUrl);

  // Should not be able to view/manage Organization
  expectDenyOrganizationAdmin(organizationAdminUrl);

  // Should be able to view "My Gridiron"
  expectCanManageMyGridiron(myGridironUrl);
});

test('Users ONLY in `Compliance User` with no product permissions', function() {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Deny    | Warn           | Manage      | Deny

  stubValidOrganization({}, { plan: 'production' });
  stubRequests();
  signInAs('compliance_user');

  // Should not be able to view Enclave
  expectEnclaveToGridironUserRedirect(enclaveUrl);

  // Should be able to access Gridiron Admin, but with error
  //TODO

  // Should not be able to view/manage Organization
  expectDenyOrganizationAdmin(organizationAdminUrl);

  // Should be able to veiw "My Gridiron"
  expectCanManageMyGridiron(myGridironUrl);
});

test('Users in any role on org without Gridiron plan', function(assert) {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Deny    | Warn           | Manage      | Deny

  stubValidOrganization({}, { plan: 'development' });
  stubRequests();
  signInAs('owner');

  // Should not be able to see "My Gridiron"
  expectDenyMyGridiron(myGridironUrl);


  // Should not be able to see gridiron admin
  andThen(() => {
    visit(enclaveUrl);
  });

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.enclave.stack.apps.index', 'redirected to enclave');
  });
});

skip ('Users in any role without enclave plan', function() {
  // Should not be able to see "Enclave"
  expectCanManageMyGridiron(myGridironUrl);
});

skip('Users ONLY in `Compliance User` with some product permissions', function() {
  // Enclave | Gridiron Admin | My Gridiron | Organization
  // ---------------------------------------------------------------------------
  // Deny    | Manage Partial | Manage      | Deny

  stubValidOrganization({}, { plan: 'production' });
  stubRequests();
  signInAs('compliance_user');

  // Should not be able to view Enclave
  expectDenyEnclave(enclaveUrl);

  // Should be able to access Gridiron Admin, but limited apps
  // TODO

  // Should be able to view "My Gridiron"
  expectCanManageMyGridiron(myGridironUrl);

  // Should not be able to view/manage Organization
  expectDenyOrganizationAdmin(organizationAdminUrl);
});

function stubRequests() {
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
