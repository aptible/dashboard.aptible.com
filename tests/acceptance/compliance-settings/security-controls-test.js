import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let securityControlsUrl = `/gridiron/${orgId}/admin/settings/security-controls`;
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

module('Acceptance: Security Program Settings: Security Controls Index', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

//let selectedDataEnvironments = { aptible: true, amazonS3: true, gmail: true };
let expectedSecurityControlGroups = ['Secure Software Development',
                                     'Human Resources Information Security'];


test('Basic UI', function(assert) {
  stubCurrentAttestations({
    selected_data_environments: {}
  });

  stubProfile({ currentStep: 'security-controls'});
  stubRequests();
  signInAndVisit(securityControlsUrl);

  andThen(() => {
    expectedSecurityControlGroups.forEach((groupName) => {
      assert.ok(find(`.info .title:contains(${groupName})`).length, `shows ${groupName}`);
    });

    let sdlc = findWithAssert('.panel.SPD_secure_software_development');
    let getStarted = sdlc.find('.start-security-control-group');
    assert.ok(getStarted.length, 'Has get started button');
    getStarted.click();
  });

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.gridiron-settings.security-controls.show', 'on show page');
  });
});

test('Resuming with existing attestations', function(assert) {
  stubCurrentAttestations({
    selected_data_environments: {},
    SPD_secure_software_development: { security_controls: { security: { implemented: true } } }
  });
  stubProfile({ currentStep: 'security-controls'});
  stubRequests();
  signInAndVisit(securityControlsUrl);

  andThen(() => {
    let sdlc = findWithAssert('.panel.SPD_secure_software_development');
    assert.ok(sdlc.hasClass('completed'), 'step is completed');
    assert.ok(sdlc.find('.fa.fa-check').length, 'has checkmark');

    sdlc.click();
  });

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.gridiron-settings.security-controls.show');
    assert.ok(find('input[name="security_controls.security.implemented"]').is(':checked'), 'Existing attestation is loaded');
  });
});

function stubRequests() {
  stubValidOrganization({ features: ['spd'] });
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
