import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref,
         securityOfficerHref } from '../../helpers/organization-stub';
import baselineRiskGraph from '.././../fixtures/risk-graph';

let application;
let userId = 'basic-user1';
let basicRoleId = 'basic-role-1';
let riskAssessmentsUrl = `/gridiron/${orgId}/admin/risk_assessments`;
let riskAssessmentPath = 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.risk-assessments';

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
    type: 'compliance_owner',
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

test(`visiting ${riskAssessmentsUrl}: with incomplete SPD`, function(assert) {
  stubProfile({ hasCompletedSetup: false });
  stubRequests();
  signInAndVisit(riskAssessmentsUrl);

  andThen(() => {
    assert.equal(currentPath(), riskAssessmentPath, 'remains on risk assessment url');
    assert.equal(find('h1:contains(Security Program Setup Required)').length, 1, 'shows message to complete SPD');
    assert.equal(find('a:contains(Set Up Security Program)').length, 1, 'shows button to complete SPD');
  });
});

test(`visiting ${riskAssessmentsUrl}: basic UI`, function(assert) {
  stubProfile({ hasCompletedSetup: true });
  stubRequests();
  signInAndVisit(riskAssessmentsUrl);

  andThen(function() {
    assert.equal(currentPath(), riskAssessmentPath, 'on risk assessment url');

    assert.equal(find('.draft-risk-assessments .ra-list-item').length, 1, 'has one draft risk assessment');
    assert.equal(find('.active-risk-assessments .ra-list-item').length, 1, 'has one active risk assessment');
    assert.equal(find('.archived-risk-assessments .ra-list-item').length, 2, 'has 2 archived risk assessments');

    let resumeButton = findWithAssert('.ra-list-item a:contains(Resume)');
    resumeButton.click();
  });

  andThen(function() {
    assert.equal(currentPath(), 'risk-assessment.threat-events.index', 'clicking draft redirects to threat events page of risk assessment');
  });
});

function stubRequests() {
  stubValidOrganization();
  stubCriterionDocuments({});
  stubStacks();
  stubCriteria();

  stubRequest('get', `/organization_profiles/${orgId}/risk-assessments`, function() {
    return this.success({ _embedded: { risk_assessments: riskAssessments  } });
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
