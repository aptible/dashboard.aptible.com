import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref,
         securityOfficerHref } from '../../helpers/organization-stub';
import baselineRiskGraph from '.././../fixtures/risk-graph';

let application;
let userId = 'basic-user-1';
let basicRoleId = 'basic-role-1';
let riskAssessmentId = 'ra1';
let riskAssessmentUrl = `/risk_assessments/${riskAssessmentId}`;

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

module('Acceptance: Risk Assessment Show Page', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${riskAssessmentUrl}: basic UI`, function(assert) {
  stubRequests();
  signInAndVisit(riskAssessmentUrl);
  let searchTerm = 'Violate isolation';

  andThen(function() {
    assert.equal(currentPath(), 'risk-assessment.threat-events.index', 'redirected to threat event list');
    baselineRiskGraph.threat_events.forEach((threatEvent) => {
      assert.equal(find(`td:contains(${threatEvent.title})`).length, 1, 'has threat event');
    });
  });

  andThen(() => {
    fillInput('search', searchTerm);
  });

  andThen(() => {
    assert.equal(find('td.aptable__row-header').length, 1, 'only one result matches search');

    let viewThreatEventButton = findWithAssert('.view-threat-event');
    viewThreatEventButton.click();
  });

  andThen(() => {
    assert.equal(currentPath(), 'threat-event.index', 'on violates isolation threat event page');
  });
});

function stubRequests() {
  stubValidOrganization();
  stubProfile({ hasCompletedSetup: true });
  stubCriterionDocuments({});
  stubStacks();
  stubBillingDetail();
  stubCriteria();

  stubRequest('get', `/organization_profiles/${orgId}/risk-assessments`, function() {
    return this.success({ _embedded: { risk_assessments: riskAssessments  } });
  });

  stubRequest('get', `/risk_assessments/${riskAssessmentId}`, function() {
    return this.success(riskAssessments[0]);
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
