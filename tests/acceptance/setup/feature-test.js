import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, invitationsHref,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;
let gridironAdminUrl = `/gridiron/${orgId}/admin`;
let riskAssessmentPath = 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.risk-assessments';
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

module('Acceptance: Setup: Presence of SPD is controlled by organization feature flag', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

skip('Organizations without SPD feature', function(assert) {
  stubValidOrganization({ features: [] });
  stubProfile();
  stubRequests();
  signInAndVisit(gridironAdminUrl);

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.index', 'remain on admin index');
    assert.equal(find('.security-program-step').length, 0, 'there are no security program nav items');
  });
});

test('Organizations with SPD feature, SPD incomplete', function(assert) {
  stubValidOrganization({ features: ['spd'] });
  stubProfile({ hasCompletedSetup: false });
  stubRequests();
  signInAndVisit(gridironAdminUrl);
  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.index', 'remain on admin index');
    assert.equal(find('.activate-notice:contains(Configure Your Security Program)').length, 1, 'shows message to start SPD');
  });
});

test('Organizations with SPD feature, SPD complete', function(assert) {
  stubValidOrganization({ features: ['spd'] });
  stubProfile({ hasCompletedSetup: true });
  stubRequests();
  signInAndVisit(gridironAdminUrl);
  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.index', 'remain on admin index');
    assert.equal(find('.security-program-step').length, 4, 'shows links to security program settings');
  });
});


test('Organizations with SPD and without Risk feature', function(assert) {
  stubValidOrganization({ features: ['spd'] });
  stubProfile({ hasCompletedSetup: true });
  stubRequests();
  signInAndVisit(gridironAdminUrl);

  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.index', 'remain on admin index');
    let riskLink = find('.panel-link.risk').first();
    riskLink.click();
  });

  andThen(() => {
    assert.notEqual(currentPath(), riskAssessmentPath, 'remain on risk assessment path');
  });
});

test('Organizations with SPD and Risk feature', function(assert) {
  stubRequest('get', `/organization_profiles/${orgId}/risk-assessments`, function() {
    return this.success({ _embedded: { risk_assessments: [] } });
  });

  stubValidOrganization({ features: ['spd', 'risk'] });
  stubProfile({ hasCompletedSetup: true });
  stubRequests();
  signInAndVisit(gridironAdminUrl);
  andThen(() => {
    assert.equal(currentPath(), 'requires-authorization.gridiron.gridiron-organization.gridiron-admin.index', 'remain on admin index');
    let riskLink = find('.panel-link.risk').first();
    riskLink.click();
  });
  andThen(() => {
    assert.equal(currentPath(), riskAssessmentPath, 'remain on risk assessment path');
  });
});

function stubRequests() {
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