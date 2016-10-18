import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let securityControlsUrl = `/gridiron/${orgId}/admin/setup/security-controls`;
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

module('Acceptance: Setup: Security Control Group', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

let selectedDataEnvironments = { };

test('clicking next will save and go to next security control group', function(assert) {
  expect(4);
  stubCurrentAttestations({
    selected_data_environments: selectedDataEnvironments,
    SPD_human_resources_information_security: {},
    SPD_secure_software_development: {}
  });
  stubProfile({ currentStep: 'security-controls'});
  stubRequests();
  signInAndVisit(`${securityControlsUrl}/SPD_secure_software_development`);

  stubRequest('post', `/organization_profiles/${orgId}/attestations`, function(request) {
    let json = this.json(request);

    assert.ok(true, 'posts to /attestations');
    assert.equal(json.handle, 'SPD_secure_software_development');

    return this.success({ id: 1 });
  });

  andThen(() => {
    let title = findWithAssert('.security-control-group-title');
    assert.ok(title.is(':contains(Secure Software Development)'), 'SDLC title is shown');
  });

  andThen(clickContinueButton);

  andThen(() => {
    let title = findWithAssert('.security-control-group-title');
    assert.ok(title.is(':contains(Human Resources)'), 'on next control group');
  });
});

test('clicking next will finish SPD if on last group', function(assert) {
  expect(7);
  stubCurrentAttestations({
    selected_data_environments: selectedDataEnvironments,
    SPD_human_resources_information_security: {},
    SPD_secure_software_development: {}
  });
  stubProfile({ currentStep: 'security-controls'});
  stubRequests();
  signInAndVisit(`${securityControlsUrl}/SPD_human_resources_information_security`);

  stubRequest('post', `/organization_profiles/${orgId}/attestations`, function(request) {
    let json = this.json(request);

    assert.ok(true, 'posts to /attestations');
    assert.equal(json.handle, 'SPD_human_resources_information_security');

    return this.success({ id: 1 });
  });

  stubRequest('put', `/organization_profiles/${orgId}`, function(request) {
    let json = this.json(request);
    json.id = orgId;

    assert.ok(true, 'updates organization profile');
    assert.equal(json.current_step, 'finish', 'on finish step');
    assert.equal(json.has_completed_setup, true, 'has completed spd');

    return this.success(json);
  });

  andThen(() => {
    let title = findWithAssert('.security-control-group-title');
    assert.ok(title.is(':contains(Human Resources)'), 'HR control group');
  });

  andThen(clickContinueButton);

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.setup.finish', 'on finish step');
  });
});

test('clicking previous will go to previous group', function(assert) {
  expect(2);

  stubCurrentAttestations({
    selected_data_environments: selectedDataEnvironments,
    SPD_human_resources_information_security: {},
    SPD_secure_software_development: {}
  });
  stubProfile({ currentStep: 'security-controls'});
  stubRequests();
  signInAndVisit(`${securityControlsUrl}/SPD_human_resources_information_security`);

  andThen(() => {
    let title = findWithAssert('.security-control-group-title');
    assert.ok(title.is(':contains(Human Resources)'), 'on HR group');
  });

  andThen(clickBackButton);

  andThen(() => {
    let title = findWithAssert('.security-control-group-title');
    assert.ok(title.is(':contains(Secure Software Development)'), 'on previous control group');
  });
});

test('clicking previous will go to index when on first group', function(assert) {
  expect(2);

  stubCurrentAttestations({
    selected_data_environments: selectedDataEnvironments,
    SPD_human_resources_information_security: {},
    SPD_secure_software_development: {}
  });
  stubProfile({ currentStep: 'security-controls'});
  stubRequests();
  signInAndVisit(`${securityControlsUrl}/SPD_secure_software_development`);

  andThen(() => {
    let title = findWithAssert('.security-control-group-title');
    assert.ok(title.is(':contains(Secure Software Development)'), 'on sdlc control group');
  });

  andThen(clickBackButton);

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.setup.security-controls.index', 'on security control index page');
  });
});

function stubRequests() {
  stubValidOrganization();
  stubSchemasAPI();
  stubCriterionDocuments({});
  stubStacks();
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
