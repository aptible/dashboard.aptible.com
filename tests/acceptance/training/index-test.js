import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, securityOfficerId, invitationsHref,
         securityOfficerHref } from '../../helpers/organization-stub';
import { fromNow, ago } from '../../helpers/date';


let application;

let userId = 'basic-user-1';
let developerId = 'developer-user-2';
let basicRoleId = 'basic-role-1';
let developerRoleId = 'developer-role-2';
let trainingCriterionId = 'training-criterion-1';
let developerCriterionId = 'developer-criterion-2';
let securityCriterionId = 'training-criterion-3';
let overviewUrl = `/compliance/${orgId}/training`;

let criteria = [
{
  id: trainingCriterionId,
  scope: 'user',
  name: 'Training Log',
  handle: 'training_log',
  _links: {
    documents: { href: `/criteria/${trainingCriterionId}/documents` }
  }
},
{
  id: developerCriterionId,
  scope: 'user',
  name: 'Developer Training Log',
  handle: 'developer_training_log',
  _links: {
    documents: { href: `/criteria/${developerCriterionId}/documents` }
  }
},
{
  id: securityCriterionId,
  scope: 'user',
  name: 'Security Officer Training Log',
  handle: 'security_officer_training_log',
  _links: {
    documents: { href: `/criteria/${securityCriterionId}/documents` }
  }
}];

let users = [
  {
    id: userId,
    name: 'Basic User',
    email: 'basicuser@asdf.com',
    _links: {
      self: { href: `/users/${userId}` }
    }
  },
  {
    id: developerId,
    name: 'Developer User',
    email: 'developeruser@asdf.com',
    _links: {
      self: { href: `/users/${developerId}` }
    }
  },
  {
    id: securityOfficerId,
    name: 'Security Officer User',
    email: 'securityofficeruser@asdf.com',
    _links: {
      self: { href: `/users/${securityOfficerId}` }
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
  },
  {
    id: developerRoleId,
    privileged: false,
    name: 'Developer Role',
    _links: {
      self: { href: `/roles/${developerRoleId}` },
      users: { href: `/roles/${developerRoleId}/users`}
    }
  }
];

module('Acceptance: Organization Training Dashboard', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${overviewUrl}: basic UI`, function(assert) {
  let documents = {};

  documents[userId] = [];
  documents[developerId] = [];
  documents[securityOfficerId] = [];

  stubUserDocuments(documents);
  stubRequests();
  signInAndVisit(overviewUrl);

  andThen(function() {
    assert.equal(currentPath(), 'compliance.compliance-organization.engines.training.index');
    assert.equal(find('.workforce-members .user').length, 3, 'shows all 3 active users');

    // user 1 is only enrolled in basic
    let user1 = find('.workforce-members .user').eq(0);
    assert.equal(user1.find('.user-name').text(), users[0].name, 'shows user name');
    assert.equal(user1.find('.status-overdue').length, 1, 'user 1 has one overdue');
    assert.equal(user1.find('.status-notEnrolled').length, 2, 'user 1 has two not_enrolled');

    // user 2 is enrolled in basic and developer
    let user2 = find('.workforce-members .user').eq(1);
    assert.equal(user2.find('.status-overdue').length, 2, 'user 2 has two overdue');
    assert.equal(user2.find('.status-notEnrolled').length, 1, 'user 2 has one not_enrolled');

    // user 3 is enrolled in all 3
    let user3 = find('.workforce-members .user').eq(2);
    assert.equal(user3.find('.status-overdue').length, 3, 'user 3 has three overdue');
    assert.equal(user3.find('.status-notEnrolled').length, 0, 'user 3 has no not_enrolled');

    assert.equal(find('.robot-users .robot-user').length, 1, 'shows 1 robot user');
    assert.equal(find('.pending-invitations .pending-invitation').length, 2, 'shows 2 pending invitations');
    assert.equal($.trim(find('.column.overdue .label').text()), '6 Overdue', 'progress bar shows overdue');
  });
});

test(`visiting ${overviewUrl}: training documents`, function(assert) {
  let documents = {};
  let trainingCriterion = { criterion: { href: `/criteria/${trainingCriterionId}` }};
  let developerCriterion = { criterion: { href: `/criteria/${developerCriterionId}` }};

  documents[userId] = [{ id: 1, _links: trainingCriterion, createdAt: ago({ months: 1}).toISOString(), expiresAt: fromNow({ years: 1}).toISOString() }];
  documents[developerId] = [{ id: 2, _links: trainingCriterion, createdAt: ago({ months: 1}).toISOString(), expiresAt: fromNow({ years: 1}).toISOString() },
                            { id: 3, _links: developerCriterion, createdAt: ago({ years: 2}).toISOString(), expiresAt: ago({ years: 1}).toISOString() }];
  documents[securityOfficerId] = [{ id: 4, _links: trainingCriterion, createdAt: ago({ months: 1}).toISOString(), expiresAt: fromNow({ years: 1}).toISOString() }];

  stubUserDocuments(documents);
  stubRequests();
  signInAndVisit(overviewUrl);

  andThen(function() {
    // User 1 has basic completed
    let user1 = find('.workforce-members .user').eq(0);
    assert.equal($.trim(user1.find('.status-complete').text()), 'Basic', 'basic is completed');
    assert.equal(user1.find('.status-notEnrolled').text().replace(/\s/g, ''), 'DeveloperSecurity', 'developer and security are not enrolled');

    // User 2 has basic completed, but developer is expired
    let user2 = find('.workforce-members .user').eq(1);
    assert.equal($.trim(user2.find('.status-complete').text()), 'Basic', 'basic is completed');
    assert.equal($.trim(user2.find('.status-expired').text()), 'Developer', 'developer is expired');

    // User 3 has basic completed, but developer and security officer are overdue
    let user3 = find('.workforce-members .user').eq(2);
    assert.equal($.trim(user3.find('.status-complete').text()), 'Basic', 'basic is completed');
    assert.equal(user3.find('.status-overdue').text().replace(/\s/g, ''), 'DeveloperSecurity', 'developer and security are not enrolled');

    // Progress bar should read: 3 complete, 1 expired, 2 overdue
    assert.equal($.trim(find('.column.completed .label').text()), '3 Completed', 'progress bar shows complete');
    assert.equal($.trim(find('.column.expired .label').text()), '1 Expired', 'progress bar shows expired');
    assert.equal($.trim(find('.column.overdue .label').text()), '2 Overdue', 'progress bar shows overdue');
  });
});

function stubUserDocuments(userDocuments) {
  stubRequest('get', '/documents', function(request) {
    let requestUser = extractUserIdFromRequestURL(request.url);
    return this.success({ _embedded: { documents: userDocuments[requestUser] } });
  });
}

function extractUserIdFromRequestURL(url) {
  let userPath = url.replace(/.+user=(\S+)$/, '$1');
  return decodeURIComponent(userPath).replace('/users/', '');
}

function stubRequests() {
  stubValidOrganization();
  stubProfile({ hasCompletedSetup: true });

  stubRequest('get', `/criteria/${trainingCriterionId}`, function() {
    return this.success({ id: 'criterion-1', handle: 'training_log' });
  });

  stubRequest('get', `/criteria/${developerCriterionId}`, function() {
    return this.success({ id: 'criterion-2', handle: 'developer_training_log' });
  });

  stubRequest('get', `/criteria/${securityCriterionId}`, function() {
    return this.success({ id: 'criterion-3', handle: 'security_officer_training_log' });
  });

  stubCurrentAttestations({
    workforce_roles: [
      { email: users[0].email, isDeveloper: false, isSecurityOfficer: false, isRobot: false, hasAptibleAccount: true },
      { email: users[1].email, isDeveloper: true, isSecurityOfficer: false, isRobot: false, hasAptibleAccount: true },
      { email: users[2].email, isDeveloper: true, isSecurityOfficer: true, isRobot: false, hasAptibleAccount: true },
      { email: 'circle@aptible.com', isDeveloper: false, isSecurityOfficer: false, isRobot: true, hasAptibleAccount: true },
      { email: 'pendingBasic@aptible.com', isDeveloper: false, isSecurityOfficer: false, isRobot: false, hasAptibleAccount: false },
      { email: 'pendingDeveloper@aptible.com', isDeveloper: true, isSecurityOfficer: false, isRobot: false, hasAptibleAccount: false }
    ]
  });

  stubRequest('get', securityOfficerHref, function() {
    return this.success(users[2]);
  });

  stubRequest('get', `/roles/${developerRoleId}/users`, function() {
    return this.success({ _embedded: { users: [users[1]] }});
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

  stubRequest('get', '/criteria', function() {
    return this.success({ _embedded: { criteria }});
  });
}
