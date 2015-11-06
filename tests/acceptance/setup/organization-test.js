import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from 'sheriff/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, securityOfficerId, securityOfficerHref } from '../../helpers/organization-stub';

let application;
let organizationUrl = `${orgId}/setup/organization`;
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
    assert.equal(currentPath(), 'organization.setup.organization', 'on organization setup page');
    assert.ok(find('.panel-section-title:contains(About Your Organization)'));
    assert.ok(find('.panel-section-title:contains(Description of your productions)'));
    assert.ok(find('textarea[name="aboutOrganization"]'));
    assert.ok(find('textarea[name="aboutProduct"]'));
  });
});

test('Clicking continue saves organization profile and moves to next step', function(assert) {
  expect(7);

  let expectedAboutOrganization = 'Secure, private cloud deployment for digital health.';
  let expectedAboutProduct = 'Seamlessly integrate advanced compliance tools';

  stubRequests();
  signInAndVisit(organizationUrl);

  stubRequest('get', `organization_profiles/${orgId}`, function(request) {
    assert.ok(true, 'attempts loads organization profile');
    return this.error(404);
  });

  stubRequest('post', `/organization_profiles/`, function(request) {
    let json = this.json(request);

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
    assert.equal(currentPath(), 'organization.setup.locations');
  });
});

function stubRequests() {
  stubValidOrganization();

  stubRequest('get', rolesHref, function(request) {
    return this.success({ _embedded: { roles } });
  });

  stubRequest('get', usersHref, function(request) {
    return this.success({ _embedded: { users }});
  });

  stubRequest('get', securityOfficerHref, function(request) {
    return this.success(users[0]);
  });
}