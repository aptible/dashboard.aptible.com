import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let organizationUrl = `/compliance/${orgId}/setup/organization`;
let roleId = 'owners-role';
let userId = 'u1';
let roles = [
  {
    id: roleId,
    privileged: true,
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
    assert.equal(currentPath(), 'compliance.compliance-organization.setup.organization', 'on organization setup page');
    assert.ok(find('.panel-section-title:contains(About Your Organization)'));
    assert.ok(find('.panel-section-title:contains(Description of your productions)'));
    assert.ok(find('textarea[name="aboutOrganization"]'));
    assert.ok(find('textarea[name="aboutProduct"]'));
  });
});

test('Clicking continue saves organization profile and moves to next step', function(assert) {
  expect(6);

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
    fillIn('textarea[name="aboutOrganization"]', expectedAboutOrganization);
    fillIn('textarea[name="aboutProduct"]', expectedAboutProduct);
  });

  andThen(clickContinueButton);

  andThen(() => {
    assert.equal(currentPath(), 'compliance.compliance-organization.setup.locations');
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