import Ember from 'ember';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref } from '../helpers/organization-stub';

Ember.Test.registerHelper('signInAs', function(app, roleTypes) {
  if(!Array.isArray(roleTypes)) {
    roleTypes = [roleTypes];
  }

  let index = 1;
  let roles = roleTypes.map(roleType => {
    let roleId = `${roleType}-${index++}`;

    return {
      id: roleId,
      type: roleType,
      _links: {
        self: { href: `/roles/${roleId}` },
        organization: { href: `/organizations/${orgId}` }
      }
    };
  });

  stubRequest('get', rolesHref, function() {
    return this.success({ _embedded: { roles } });
  });

  signIn({}, roles);
});

Ember.Test.registerHelper('expectCanManageEnclave', function(app, enclaveUrl) {
  visit(enclaveUrl);
  andThen(() => {
    equal(currentPath(), 'requires-authorization.enclave.stack.apps.index',
                'expectCanManageEnclave: visiting enclave dashboard remains on enclave dashboard');
    equal(find('.sidebar-nav .sidebar-stack-item').length, 2,
                'expectCanManageEnclave: shows both stacks');
    equal(find('.application-nav .enclave-nav').length, 1,
                'expectCanManageEnclave: shows enclave in menu');
  });
});

Ember.Test.registerHelper('expectCanManageGridironAdmin', function(app, gridironAdminUrl) {
  let expectedEngines = ['risk', 'policy', 'training', 'security'];
  visit(gridironAdminUrl);

  andThen(() => {
    equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.index',
                'expectCanManageGridironAdmin: remain on gridiron admin');
    expectedEngines.forEach((engine) => {
      equal(find(`.${engine}-engine-status`).length, 1,
                  `expectCanManageGridironAdmin: shows ${engine} panel`);
    });
    equal(find('.application-nav .gridiron-nav').length, 1,
                'expectCanManageGridironAdmin: shows gridiron in main menu');
  });

  andThen(openUserToggle);

  andThen(() => {
    let adminLink = find('.dashboard-dropdown-organization-menu .gridiron-admin');
    equal(adminLink.length, 1, 'expectCanManageGridironAdmin: has gridiron admin link');
  });
});

Ember.Test.registerHelper('expectCanManageOrganizationAdmin', function(app, organizationAdminUrl) {
  visit(organizationAdminUrl);
  andThen(() => {
    equal(currentPath(), 'requires-authorization.organization.admin.contact-settings',
                'expectCanManageOrganizationAdmin: remains on contact settings page');

    equal(find('.organization-settings .contact-settings').length, 1,
                      'expectCanManageOrganizationAdmin: organization sidebar shows contact settings link');
  });
});

Ember.Test.registerHelper('expectCanManageMyGridiron', function(app, myGridironUrl) {
  visit(myGridironUrl);
  andThen(() => {
    equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-user',
                'expectCanManageMyGridiron: remains on gridiron user');
  });

  andThen(openUserToggle);

  andThen(() => {
    // TODO: WHY IS THIS SO FLAKEY???
    // equal(find('.dashboard-dropdown-organization-menu .gridiron-user').length, 1,
    //             'expectCanManageMyGridiron: has my gridiron link in dropdown nav');
  });
});

Ember.Test.registerHelper('expectDenyGridironAdmin', function(app, gridironAdminUrl) {
  visit(gridironAdminUrl);
  andThen(() => {
    equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-user',
                'expectDenyGridironAdmin: redirected to gridiron user');
  });

  andThen(openUserToggle);

  andThen(() => {
    let adminLink = find('.dashboard-dropdown-organization-menu .gridiron-admin');
    equal(adminLink.length, 0, 'expectDenyGridironAdmin: has no gridiron admin link');
  });
});


Ember.Test.registerHelper('expectDenyEnclave', function(app, enclaveUrl) {
  visit(enclaveUrl);
  andThen(() => {
    // Should be redirected to "My Gridiron" with error message
    equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-user',
                'expectDenyEnclave: redirected to "My Compliance" page');
    // equal(find('.danger:contains(Access Denied)').length, 1,
    //             'expectDenyEnclave: shows access denied error message');
    equal(find('.application-nav .enclave-nav').length, 0,
                'expectDenyEnclave: has no link to enclave in main nav');
  });
});

Ember.Test.registerHelper('expectDenyOrganizationAdmin', function(app, organizationAdminUrl) {
  visit(organizationAdminUrl);
  andThen(() => {
    equal(currentPath(), 'requires-authorization.organization.members.index',
                'expectDenyOrganizationAdmin: redirected to organization members index');
  });

  andThen(openUserToggle);

  andThen(() => {
    // equal(find('.danger:contains(Access Denied)').length, 1,
    //              'expectDenyOrganizationAdmin: shows access denied error');
    equal(find('.dashboard-dropdown-organization-menu .organization-settings').length, 0,
                'expectDenyOrganizationAdmin: has no organization settings link');
    equal(find('.dashboard-dropdown-organization-menu .organization-members').length, 1,
                'expectDenyOrganizationAdmin: has organization members link');
  });
});

Ember.Test.registerHelper('expectEnclaveToGridironAdminRedirect', function(app, enclaveUrl) {
  visit(enclaveUrl);
  andThen(() => {
    equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.index',
                'expectEnclaveToGridironAdminRedirect: redirected to gridiron admin when accessing enclave');
  });
});

Ember.Test.registerHelper('expectEnclaveToGridironUserRedirect', function(app, enclaveUrl) {
  visit(enclaveUrl);

  andThen(() => {
    equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-user',
                'expectEnclaveToGridironUserRedirect: redirected to "My Compliance"');
  });
});

Ember.Test.registerHelper('expectErrorOnEnclave', function() {
  // TODO: ??
  ok(true);
});

Ember.Test.registerHelper('expectDenyMyGridiron', function(app, myGridironUrl) {
  ok(true);
  visit(myGridironUrl);

  andThen(() => {
    equal(currentPath(), 'requires-authorization.enclave.stack.apps.index',
                'expectDenyMyGridiron: redirected off my gridiron to enclave');
  });
  andThen(openUserToggle);
  andThen(() => {
    equal(find('.dashboard-dropdown-organization-menu .gridiron-user').length, 0,
                'expectDenyMyGridiron: has no my gridiron link in dropdown nav');
  });
});

Ember.Test.registerHelper('openUserToggle', function() {
  let dropToggle = findWithAssert('.current-user .dropdown-toggle').eq(0);
  dropToggle.click();
});
