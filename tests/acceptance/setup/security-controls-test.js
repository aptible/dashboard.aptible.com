import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from 'sheriff/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref, securityOfficerId,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let securityControlsUrl = `${orgId}/setup/security-controls`;
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

module('Acceptance: Setup: Security Controls', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

let selectedDataEnvironments = [
  { name: 'Aptible PaaS', provider: 'aptible', handle: 'aptible', selected: true },
  { name: 'EC2', provider: 'aws', handle: 'ec2', selected: false },
  { name: 'S3', provider: 'aws', handle: 's3', selected: false },
  { name: 'Google Drive', provider: 'google', handle: 'google-drive', selected: false },
  { name: 'Workstations', provider: false, handle: 'workstations', selected: false },
];

test('Selected data environments are used to draw security control questionnaire', function(assert) {
  stubProfile({ currentStep: 'security-controls', selectedDataEnvironments });
  stubRequests();
  signInAndVisit(securityControlsUrl);

  andThen(() => {
    //return pauseTest();
    // Should show AWS Provider questions
    assert.ok(find('.data-environment-provider.sm.aws').length, 'Has an AWS provider logo');
    assert.ok(find('.title:contains(AWS Console Access)').length, 'Has an AWS provider question');
    assert.ok(find('.panel-title:contains(EC2)').length, 'Has Google Drive DE panel');

    // Should show Google Provider questions
    assert.ok(find('.data-environment-provider.sm.google').length, 'Has an Google provider logo');
    assert.ok(find('.title:contains(Multi-factor Authentication (MFA))').length, 'Has a Google provider question');
    assert.ok(find('.panel-title:contains(Google Drive)').length, 'Has Google Drive DE panel');
    // Should show Google Drive Data Environment questions
    // Should show Aptible Provider questions
    // Should show provider-less (Workstations) Data Environment questions
  });

});

skip('Uses a schema document to show security control questions for each data environment');
skip('Uses a schema document to show security control questions for each provider');
skip('Uses a schema document to show global security control questions');
skip('With no data environments configured it redirects back to data environment step');
skip('Clicking continue saves attestation for each data environment');

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
}
