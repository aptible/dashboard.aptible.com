import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from 'sheriff/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref, securityOfficerId,
         securityOfficerHref } from '../../helpers/organization-stub';
import { DATA_ENVIRONMENTS } from 'sheriff/setup/data-environments/route';

let application;
let dataEnvironmentsUrl = `${orgId}/setup/start`;
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

module('Acceptance: Setup: Data Environments', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('Basic setup start page UI', function(assert) {
  stubProfile({ currentStep: 'start' });
  stubRequests();
  signInAndVisit(startUrl);

  andThen(() => {
    assert.ok(find('h1:contains(Design Your Compliance Program in 6 Steps)'));
    assert.ok(find('p:contains(Lorem ipsum)'));
    // Title
    // Description
    // Step Icons
    // Continue button to next step
  });
});

test('Existing organization profiles should redirect to future step', function(assert) {
  assert.ok(true);
});
