import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from 'sheriff/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref, securityOfficerId,
         securityOfficerHref } from '../../helpers/organization-stub';
import { DATA_ENVIRONMENTS } from 'sheriff/setup/data-environments/route';

let application;
let startUrl = `${orgId}/setup/start`;
let userId = 'basic-user-1';
let developerId = 'developer-user-2';
let basicRoleId = 'basic-role-1';
let developerRoleId = 'developer-role-2';

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

let roles = [
  {
    id: basicRoleId,
    privileged: false,
    name: 'Basic Role',
    _links: {
      self: { href: `/roles/${basicRoleId}` },
      users: { href: `/roles/${basicRoleId}/users`}
    }
  }
];

let permissions = [
  {
    id: '1',
    scope: 'manage',
    _links: {
      role: { href: `/roles/${developerRoleId}` }
    }
  }
];

module('Acceptance: Setup: Getting Started', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('Basic setup start page UI', function(assert) {
  expect(6);

  stubProfile({ currentStep: 'start' });
  stubRequests();
  signInAndVisit(startUrl);

  stubRequest('put', `/organization_profiles/${orgId}`, function(request) {
    let json = this.json(request);
    json.id = orgId;

    assert.ok(true, 'updates organization profile');
    assert.equal(json.current_step, 'organization');

    return this.success(json);
  });

  andThen(() => {
    let continueButton = find('button:contains(get started)');

    assert.ok(find('h1:contains(Design Your Compliance Program in 6 Steps)').length, 'has a title');
    assert.ok(find('.intro-text:contains(Lorem ipsum)').length, 'has a descriptive paragraph');
    assert.ok(continueButton.length, 'has a continue button');
    continueButton.click();
  });

  andThen(() => {
    assert.equal(currentPath(), 'organization.setup.organization', 'moved to next step');
  });
});

test('Existing organization profiles should redirect to future step', function(assert) {
  stubProfile({ currentStep: 'locations' });
  stubRequests();
  signInAndVisit(startUrl);

  andThen(() => {
    assert.equal(currentPath(), 'organization.setup.locations.index', 'redirected to current step');
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

  stubRequest('get', invitationsHref, function(request) {
    return this.success({ _embedded: { invitations: [] }});
  });

  stubRequest('get', securityOfficerHref, function(request) {
    return this.success(users[0]);
  });

  stubRequest('get', '/permissions', function(request) {
    return this.success({ _embedded: { permissions }});
  });
}