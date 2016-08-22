import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, securityOfficerId, invitationsHref,
         securityOfficerHref, trainingCriterionId,
         criteria } from '../../helpers/organization-stub';
import { fromNow, ago } from '../../helpers/date';

let application;

let userId = 'basic-user-1';
let developerId = 'developer-user-2';
let basicRoleId = 'basic-role-1';
let developerRoleId = 'developer-role-2';
let overviewUrl = `/compliance/${orgId}/training`;


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
    type: 'platform_user',
    name: 'Basic Role',
    _links: {
      self: { href: `/roles/${basicRoleId}` },
      users: { href: `/roles/${basicRoleId}/users`}
    }
  },
  {
    id: developerRoleId,
    type: 'platform_user',
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
  stubCriterionDocuments(documents);
  stubRequests();
  signInAndVisit(overviewUrl);

  andThen(function() {
    assert.equal(currentPath(), 'compliance.compliance-organization.compliance-engines.training');
    assert.equal(find('.workforce-members .user').length, 3, 'shows all 3 active users');
    let user1 = find('.workforce-members .user').eq(0);

    assert.equal(user1.find('.user-name').text(), users[0].name, 'shows user name');
    assert.equal(user1.find('.status-incomplete').length, 1, 'user 1 has one overdue');
    assert.equal(find('.status-incomplete').length, 3, 'all three are incomplete');

    assert.equal($.trim(find('.column.overdue .bar-label').text()), '3 Overdue', 'progress bar shows overdue');
  });
});

test(`visiting ${overviewUrl}: training documents`, function(assert) {
  let documents = {};
  documents[trainingCriterionId] = [
    {
      id: 'document-1',
      userUrl:`/users/${userId}`,
      created_at: ago({ months: 1 }),
      expires_at: fromNow({ years: 1 }),
      _links: {
        criteria: { href: `/criteria/${trainingCriterionId}` }
      }
    },
    {
      id: 'document-2',
      userUrl:`/users/${developerId}`,
      created_at: ago({ years: 2 }),
      expires_at: ago({ years: 1 }),
      _links: {
        criteria: { href: `/criteria/${trainingCriterionId}` }
      }
    }
  ];

  stubCriterionDocuments(documents);
  stubRequests();
  signInAndVisit(overviewUrl);

  andThen(() => {
    assert.equal(currentPath(), 'compliance.compliance-organization.compliance-engines.training');
    let userPanels = find('.workforce-members .user');
    assert.equal(userPanels.length, 3, 'shows all 3 active users');
    let user1 = userPanels.eq(0);
    let user2 = userPanels.eq(1);

    assert.equal(user1.find('.status-complete').length, 1, 'user 1 has completed training');
    assert.ok(/Basic/.test(user1.find('.status-complete').text()), 'user 1 has completed training');

    assert.equal(user2.find('.status-expired').length, 1, 'user 2 has expired training');

    assert.equal($.trim(find('.column.completed .bar-label').text()), '1 Completed', 'progress bar shows complete count');
    assert.equal($.trim(find('.column.expired .bar-label').text()), '1 Expired', 'progress bar shows expired count');
    assert.equal($.trim(find('.column.overdue .bar-label').text()), '1 Overdue', 'progress bar shows overdue count');
  });
});

function stubRequests() {
  stubValidOrganization();
  stubStacks();
  stubBillingDetail();
  stubProfile({ hasCompletedSetup: true });
  stubCriteria(criteria);

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
}
