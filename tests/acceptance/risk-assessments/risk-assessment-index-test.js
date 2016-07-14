import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref,
         securityOfficerHref } from '../../helpers/organization-stub';
import baselineRiskGraph from '.././../fixtures/risk-graph';

let application;
let userId = 'basic-user-1';
let basicRoleId = 'basic-role-1';
let riskAssessmentsUrl = `/compliance/${orgId}/risk_assessments`;

let riskAssessments = [
  { id: 'ra1', status: 'draft', _embedded: baselineRiskGraph },
  { id: 'ra2', status: 'current', _embedded: baselineRiskGraph },
  { id: 'ra3', status: 'archived', _embedded: baselineRiskGraph },
  { id: 'ra4', status: 'archived', _embedded: baselineRiskGraph }
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

let roles = [
  {
    id: basicRoleId,
    type: 'platform_user',
    name: 'Basic Role',
    _links: {
      self: { href: `/roles/${basicRoleId}` },
      users: { href: `/roles/${basicRoleId}/users`}
    }
  }
];

module('Acceptance: Risk Assessment Index', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${riskAssessmentsUrl}: basic UI`, function(assert) {
  stubRequests();
  signInAndVisit(riskAssessmentsUrl);

  andThen(function() {
    assert.equal(currentPath(), 'compliance.compliance-organization.engines.risk-assessments', 'on risk assessment url');

    assert.equal(find('.ra__status-header--draft').length, 1, 'has one draft risk assessment');
    assert.equal(find('.ra__status-header--current').length, 1, 'has one active risk assessment');
    assert.equal(find('.ra__status-header--archived').length, 2, 'has 2 archived risk assessments');

    let resumeButton = findWithAssert('.ra-list-item a:contains(Resume)');
    resumeButton.click();
  });

  andThen(function() {
    assert.equal(currentPath(), 'risk-assessment.threat-events.index', 'clicking draft redirects to threat events page of risk assessment');
  });
});

function stubRequests() {
  stubValidOrganization();
  stubProfile({ hasCompletedSetup: true });

  stubRequest('get', `/organization_profiles/${orgId}/risk-assessments`, function() {
    return this.success({ _embedded: { risk_assessments: riskAssessments  } });
  });

  stubRequest('get', usersHref, function() {
    return this.success({ _embedded: { users }});
  });

  stubRequest('get', securityOfficerHref, function() {
    return this.success(users[0]);
  });

  stubRequest('get', rolesHref, function() {
    return this.success({ _embedded: { roles } });
  });

  stubRequest('get', usersHref, function() {
    return this.success({ _embedded: { users }});
  });

  stubRequest('get', invitationsHref, function() {
    return this.success({ _embedded: { invitations: [] }});
  });
}
