import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let organizationUrl = `/gridiron/${orgId}/admin/setup/organization`;
let roleId = 'owners-role';
let userId = 'u1';
let roles = [
  {
    id: roleId,
    type: 'owner',
    name: 'Owners',
    _links: {
      self: { href: `/roles/${roleId}` },
      users: { href: `/roles/${roleId}/users`}
    }
  }
];

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

module('Acceptance: Setup: Organization', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('Organization settings page basic UI', function(assert) {
  stubProfile({ currentStep: 'organization' });
  stubRequests();
  signInAndVisit(organizationUrl);

  andThen(() => {
    assert.equal(currentPath(), 'gridiron.gridiron-organization.gridiron-admin.setup.organization', 'on organization setup page');
    assert.ok(find('textarea[name="aboutOrganization"]'), 'has about organization');
    assert.ok(find('textarea[name="aboutProduct"]'), 'has about product');
    assert.ok(find('textarea[name="aboutArchitecture"]'), 'has about architecture');
  });
});

test('Clicking continue saves organization profile and moves to next step', function(assert) {
  expect(8);

  let expectedAboutOrganization = 'Secure, private cloud deployment for digital health.';
  let expectedAboutProduct = 'Seamlessly integrate advanced compliance tools';

  stubProfile({ currentStep: 'organization', id: orgId });
  stubCurrentAttestations({ locations: [] });
  stubRequests();
  signInAndVisit(organizationUrl);

  stubRequest('put', `/organization_profiles/${orgId}`, function(request) {
    let json = this.json(request);
    json.id = orgId;

    assert.ok(true, 'puts to update organization profile');
    assert.equal(json.id, orgId);
    assert.equal(json.about_organization, expectedAboutOrganization);
    assert.equal(json.about_product, expectedAboutProduct);
    assert.equal(json.current_step, 'locations');

    return request.ok(json);
  });

  andThen(() => {
    assert.equal(currentPath(), 'gridiron.gridiron-organization.gridiron-admin.setup.organization', 'on organization setup page');
    fillIn('textarea[name="aboutOrganization"]', expectedAboutOrganization);
    fillIn('textarea[name="aboutProduct"]', expectedAboutProduct);
  });

  andThen(clickContinueButton);

  andThen(() => {
    assert.equal(currentPath(), 'gridiron.gridiron-organization.gridiron-admin.setup.organization', 'remain on current step when form is incomplete');
    fillIn('textarea[name="aboutArchitecture"]', 'Test');
    fillIn('textarea[name="aboutBusinessModel"]', 'Test');
    fillIn('textarea[name="aboutTeam"]', 'Test');
    fillIn('textarea[name="aboutGoToMarket"]', 'Test');
  });

  andThen(clickContinueButton);
  andThen(() => {
    assert.equal(currentPath(), 'gridiron.gridiron-organization.gridiron-admin.setup.locations', 'moved to next step');
  });
});

test('Save progress', function(assert) {
  expect(4);

  let expectedAboutOrganization = 'Secure, private cloud deployment for digital health.';
  let expectedAboutProduct = 'Seamlessly integrate advanced compliance tools';

  stubProfile({ currentStep: 'organization', id: orgId });
  stubCurrentAttestations({ locations: [] });
  stubRequests();
  signInAndVisit(organizationUrl);

  stubRequest('put', `/organization_profiles/${orgId}`, function(request) {
    let json = this.json(request);
    json.id = orgId;

    assert.ok(true, 'puts to update organization profile');
    assert.equal(json.id, orgId);
    assert.equal(json.about_organization, expectedAboutOrganization);
    assert.equal(json.about_product, expectedAboutProduct);

    return request.ok(json);
  });

  andThen(() => {
    fillIn('textarea[name="aboutOrganization"]', expectedAboutOrganization);
    fillIn('textarea[name="aboutProduct"]', expectedAboutProduct);
  });

  andThen(clickSaveButton);
});

function clickSaveButton() {
  let button = findWithAssert('button.spd-nav-save');
  button.click();
}

function stubRequests() {
  stubValidOrganization();
  stubSchemasAPI();
  stubCriterionDocuments({});
  stubStacks();
  stubBillingDetail();
  stubCriteria();

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