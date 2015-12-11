import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'sheriff/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { orgId, rolesHref, usersHref, securityOfficerId, invitationsHref,
         securityOfficerHref } from '../../helpers/organization-stub';

let application;

let userId = 'basic-user-1';
let developerId = 'developer-user-2';
let basicRoleId = 'basic-role-1';
let developerRoleId = 'developer-role-2';
let trainingCriterionId = 'training-criterion-1';
let developerCriterionId = 'developer-criterion-2';
let securityCriterionId = 'training-criterion-3';
let overviewUrl = `/${orgId}/training`;
let basicUrl = `/${orgId}/training/training_log`;
let developerUrl = `/${orgId}/training/developer_training_log`;
let securityUrl = `/${orgId}/training/security_officer_training_log`;

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

let permissions = [
  {
    id: '1',
    scope: 'manage',
    _links: {
      role: { href: `/roles/${developerRoleId}` }
    }
  },
  {
    id: '2',
    scope: 'read',
    _links: {
      role: { href: `/roles/${basicRoleId}` }
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

// test(`visiting ${overviewUrl} requires authentication`, function(assert) {
//   expectRequiresAuthentication(overviewUrl);
// });

test(`visiting ${overviewUrl}: shows all users`, function(assert) {
  stubDocuments({ basic: [], security: [], developer: [] });
  stubRequests();
  signInAndVisit(overviewUrl);

  andThen(function() {
    assert.equal(currentPath(), 'organization.engines.training.index');
    ok(find('.user-training-status .name:contains(Basic User)'),
            'shows basic user');
    ok(find('.user-training-status .name:contains(Developer User)'),
            'shows developer user');
    ok(find('.user-training-status .name:contains(Security Officer User)'),
            'shows security officer user');
  });
});

test(`visiting ${overviewUrl}: all users list basic training`, function(assert) {
  stubDocuments({ basic: [], security: [], developer: [] });
  stubRequests();
  signInAndVisit(overviewUrl);

  andThen(function() {
    assert.equal(currentPath(), 'organization.engines.training.index');
    ok(find('.user-training-status .subject-checklist .training_log').length === 3,
            'all 3 users list basic training');
  });
});

test(`visiting ${overviewUrl}: all developers list developer training`, function(assert) {
  stubDocuments({ basic: [], security: [], developer: [] });
  stubRequests();
  signInAndVisit(overviewUrl);

  andThen(function() {
    assert.equal(currentPath(), 'organization.engines.training.index');
    ok(find('.developer_training_log:contains(Developer Training)').length === 1,
            'only one developer training log');
  });
});

test(`visiting ${overviewUrl}: security officer shows security officer training`, function(assert) {
  stubDocuments({ basic: [], security: [], developer: [] });
  stubRequests();
  signInAndVisit(overviewUrl);

  andThen(function() {
    assert.equal(currentPath(), 'organization.engines.training.index');
    ok(find('.security_officer_training_log:contains(Security Officer Training)').length === 1,
            'only one security officer training log');
  });
});

test(`visiting ${basicUrl} shows all users under basic training criterion`, function(assert) {
  stubDocuments({ basic: [], security: [], developer: [] });
  stubRequests();
  signInAndVisit(basicUrl);

  andThen(function() {
    assert.equal(currentPath(), 'organization.engines.training.criterion.index');

    let el = find('.criterion-subjects.training_log');
    ok(el.find('.user-training-status').length === 3,
               'all 3 users appear in basic training log');
  });
});

test(`visiting ${developerUrl} shows all developers under developer training criterion`, function(assert) {
  stubDocuments({ basic: [], security: [], developer: [] });
  stubRequests();
  signInAndVisit(developerUrl);

  andThen(function() {
    assert.equal(currentPath(), 'organization.engines.training.criterion.index');

    let el = find('.criterion-subjects.developer_training_log');
    ok(el.find('.user-training-status').length === 1,
               'one developer appears in developer training log');
    ok(el.find(':contains(Developer User)'),
               'developer user appears in developer training log');
  });
});


test(`visiting ${securityUrl} shows security officer under security officer training criterion`, function(assert) {
  stubDocuments({ basic: [], security: [], developer: [] });
  stubRequests();
  signInAndVisit(securityUrl);

  andThen(function() {
    assert.equal(currentPath(), 'organization.engines.training.criterion.index');

    let el = find('.criterion-subjects.security_officer_training_log');
    ok(el.find('.user-training-status').length === 1,
               'security officer appears in security officer training log');
    ok(el.find(':contains(Security Officer User)'),
               'security officer user appears in security officer training log');
  });
});

test(`visiting ${basicUrl} with an untrained user shows a red x`, function(assert) {
  stubDocuments({ basic: [], security: [], developer: [] });
  stubRequests();
  signInAndVisit(basicUrl);

  andThen(function() {
    assert.equal(currentPath(), 'organization.engines.training.criterion.index');

    let el = find('.criterion-subjects.training_log');
    let user = el.find('.user-training-status:contains(Basic User)');

    ok(user.length, 'basic user is visible in basic training log');
    ok(user.find('.is-compliant-false').length, 'is not compliant');
    ok(user.find('.fa-times-circle').length, 'has red x icon');
  });
});

test(`visiting ${developerUrl} with an untrained developer shows a red x`, function(assert) {
  stubDocuments({ basic: [], security: [], developer: [] });
  stubRequests();
  signInAndVisit(developerUrl);

  andThen(function() {
    assert.equal(currentPath(), 'organization.engines.training.criterion.index');

    let el = find('.criterion-subjects.developer_training_log');
    let user = el.find('.user-training-status:contains(Developer User)');

    ok(user.length, 'developer is visible in developer training log');
    ok(user.find('.is-compliant-false').length, 'is not compliant');
    ok(user.find('.fa-times-circle').length, 'has red x icon');
  });
});

test(`visiting ${securityUrl} with an untrained security officer shows a red x`, function(assert) {
  stubDocuments({ basic: [], security: [], developer: [] });
  stubRequests();
  signInAndVisit(securityUrl);

  andThen(function() {
    assert.equal(currentPath(), 'organization.engines.training.criterion.index');

    let el = find('.criterion-subjects.security_officer_training_log');
    let user = el.find('.user-training-status:contains(Security Officer User)');

    ok(user.length, 'security officer is visible in security officer training log');
    ok(user.find('.is-compliant-false').length, 'is not compliant');
    ok(user.find('.fa-times-circle').length, 'has red x icon');
  });
});

test(`visiting ${basicUrl} with trained user shows a green check`, function(assert) {
  let trainingDocument = {
    id: 'basic-training-document',
    created_at: '2015-05-27T17:47:13.287Z',
    data: {},
    expires_at: null,
    organization_url: `/organizations/${orgId}`,
    user_url: `/users/${userId}`
  };

  stubDocuments({ basic: [trainingDocument], security: [], developer: [] });
  stubRequests();
  signInAndVisit(basicUrl);

  andThen(function() {
    assert.equal(currentPath(), 'organization.engines.training.criterion.index');

    let el = find('.criterion-subjects.training_log');
    let user = el.find('.user-training-status:contains(Basic User)');

    ok(user.length, 'basic user is visible in basic training log');
    ok(user.find('.is-compliant-true  ').length, 'is compliant');
    ok(user.find('.fa-check-circle').length, 'has green check icon');
    ok(user.find(':contains(May 27, 2015)').length, 'shows completed date');
  });
});

test(`visiting ${developerUrl} with trained developer shows a green check`, function(assert) {
  let trainingDocument = {
    id: 'developer-training-document',
    created_at: '2015-05-27T17:47:13.287Z',
    data: {},
    expires_at: null,
    organization_url: `/organizations/${orgId}`,
    user_url: `/users/${developerId}`
  };

  stubDocuments({ basic: [], security: [], developer: [trainingDocument] });
  stubRequests();
  signInAndVisit(developerUrl);

  andThen(function() {
    assert.equal(currentPath(), 'organization.engines.training.criterion.index');

    let el = find('.criterion-subjects.developer_training_log');
    let user = el.find('.user-training-status:contains(Developer User)');

    ok(user.length, 'developer is visible in developer training log');
    ok(user.find('.is-compliant-true ').length, 'is compliant');
    ok(user.find('.fa-check-circle').length, 'has green check icon');
    ok(user.find(':contains(May 27, 2015)').length, 'shows completed date');
  });
});

test(`visiting ${securityUrl} with trained security officer shows a green check`, function(assert) {
  let trainingDocument = {
    id: 'security-officer-training-document',
    created_at: '2015-05-27T17:47:13.287Z',
    data: {},
    expires_at: null,
    organization_url: `/organizations/${orgId}`,
    user_url: `/users/${securityOfficerId}`
  };

  stubDocuments({ basic: [], security: [trainingDocument], developer: [] });
  stubRequests();
  signInAndVisit(securityUrl);

  andThen(function() {
    assert.equal(currentPath(), 'organization.engines.training.criterion.index');

    let el = find('.criterion-subjects.security_officer_training_log');
    let user = el.find('.user-training-status:contains(Security Officer User)');

    ok(user.length, 'security officer is visible in security training log');
    ok(user.find('.is-compliant-true ').length, 'is compliant');
    ok(user.find('.fa-check-circle').length, 'has green check icon');
    ok(user.find(':contains(May 27, 2015)').length, 'shows completed date');
  });
});


function stubDocuments(opts = {}) {
  if(!opts.basic) { opts.basic = []; }
  if(!opts.developer) { opts.developer = []; }
  if(!opts.security) { opts.security = []; }

  stubRequest('get', `/criteria/${trainingCriterionId}/documents`, function(request) {
    return this.success({ _embedded: { documents: opts.basic }});
  });

  stubRequest('get', `/criteria/${securityCriterionId}/documents`, function() {
    return this.success({ _embedded: { documents: opts.security }});
  });

  stubRequest('get', `/criteria/${developerCriterionId}/documents`, function() {
    return this.success({ _embedded: { documents: opts.developer }});
  });
}

function stubRequests() {
  stubValidOrganization();

  stubRequest('get', `/roles/${developerRoleId}/users`, function() {
    return this.success({ _embedded: { users: [users[1]] }});
  });

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
    return this.success(users[2]);
  });

  stubRequest('get', '/permissions', function(request) {
    return this.success({ _embedded: { permissions }});
  });

  stubRequest('get', '/criteria', function(request) {
    return this.success({ _embedded: { criteria }});
  });
}
