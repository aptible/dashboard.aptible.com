import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

let App;
let impersonateUrl = '/settings/impersonate';

let targetUserId = 'test-user-id';
let targetUserEmail = 'testUser@email.com';
let targetUserName = 'Test User';
let targetUserUrl = `/users/${targetUserId}`;

let adminTokenId = 'admin-token-id';
let adminTokenValue = 'admin-token-value';

let adminUserId = 'admin-user-id';
let adminUserName = 'Admin User';
let adminUserUrl = `/users/${adminUserId}`;

let organizationHref = 'http://test/organizations/1';

let adminUserData = {
  id: adminUserId,
  name: adminUserName,
  superuser: true
};

let targetUserData = {
  id: targetUserId,
  email: targetUserEmail,
  name: targetUserName,
};

let adminTokenData = {
  id: adminTokenId,
  access_token: adminTokenValue
};

let userTokenData = {
  id: 'new-token-id',
  access_token: 'new-token',
  token_type: 'bearer',
  expires_in: 2,
  scope: 'read',
  type: 'token',
  _links: {
    user: {
      href: targetUserUrl
    },
    actor: {
      href: adminUserUrl
    }
  }
};

module('Acceptance: Impersonation', {
  beforeEach: function() {
    App = startApp();
    stubStacks();
    stubOrganization();

    stubRequest('get', adminUserUrl, function (request) {
      request.ok(adminUserData);
    });

    stubRequest('get', targetUserUrl, function (request) {
      request.ok(targetUserData);
    });
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test(`${impersonateUrl} requires authentication`, function() {
  expectRequiresAuthentication(impersonateUrl);
});

test('Impersonation succeeds with RO access', function(assert) {
  var deletedAdminToken = false;

  stubRequest('post', '/tokens', function(request) {
    let params = this.json(request);
    assert.equal(params.grant_type, 'urn:ietf:params:oauth:grant-type:token-exchange');
    assert.equal(params.actor_token, adminTokenValue);
    assert.equal(params.actor_token_type, 'urn:ietf:params:oauth:token-type:jwt');
    assert.equal(params.subject_token, targetUserEmail);
    assert.equal(params.subject_token_type, 'aptible:user:email');
    assert.equal(params.scope, 'read', 'Token is read-only');
    assert.ok(request.withCredentials, 'Token is persisted to cookies');
    return this.success(userTokenData);
  });

  stubRequest('delete', `/tokens/${adminTokenId}`, function(request) {
    assert.ok(!request.withCredentials, 'Token deletion is not persisted to cookies');
    assert.equal(request.requestHeaders.Authorization, `Bearer ${adminTokenValue}`, 'DELETEd admin token as admin user');
    deletedAdminToken = true;
    return this.success();
  });

  signInAndVisit(impersonateUrl, adminUserData, {}, adminTokenData);
  fillInput('email', targetUserEmail);
  clickButton('Impersonate');
  andThen(() => {
    assert.ok(deletedAdminToken, 'admin token was deleted');
    expectReplacedLocation('/');
  });
});

test('Impersonation succeeds with R/W access', function(assert) {
  stubRequest('post', '/tokens', function(request) {
    let params = this.json(request);
    assert.equal(params.scope, 'manage', 'Token is read-write');
    assert.ok(request.withCredentials, 'Token is persisted to cookies');
    return this.success(userTokenData);
  });

  stubRequest('delete', `/tokens/${adminTokenId}`, function(request) {
    assert.ok(!request.withCredentials, 'Token deletion is not persisted to cookies');
    return this.success();
  });

  signInAndVisit(impersonateUrl, adminUserData, {}, adminTokenData);
  fillInput('email', targetUserEmail);
  check('read-write');
  clickButton('Impersonate');
  andThen(() => {
    expectReplacedLocation('/');
  });
});

test('Impersonation succeeds with an organization target', function(assert) {
  stubRequest('post', '/tokens', function(request) {
    let params = this.json(request);
    assert.equal(params.grant_type, 'urn:ietf:params:oauth:grant-type:token-exchange');
    assert.equal(params.actor_token, adminTokenValue);
    assert.equal(params.actor_token_type, 'urn:ietf:params:oauth:token-type:jwt');
    assert.equal(params.subject_token, organizationHref);
    assert.equal(params.subject_token_type, 'aptible:organization:href');
    assert.equal(params.scope, 'read', 'Token is read-only');
    assert.ok(request.withCredentials, 'Token is persisted to cookies');
    return this.success(userTokenData);
  });

  stubRequest('delete', `/tokens/${adminTokenId}`, function(request) {
    assert.ok(!request.withCredentials, 'Token deletion is not persisted to cookies');
    return this.success();
  });

  signInAndVisit(impersonateUrl, adminUserData, {}, adminTokenData);
  fillInput('organizationHref', organizationHref);
  clickButton('Impersonate');
  andThen(() => {
    expectReplacedLocation('/');
  });
});

test('Actor name is shown when impersonating', function(assert) {
  assert.expect(0);
  signInAndVisit('/', targetUserData, {}, userTokenData);

  andThen(() => {
    findWithAssert(`header.navbar:contains('${adminUserName} (as ${targetUserName})')`);
  });
});

test('Impersonation fails', function(assert) {
  stubRequest('post', '/tokens', function() {
    return this.error(401, {
      code: 401,
      error: 'invalid_grant',
      message: 'Invalid grant'
    });
  });

  signInAndVisit(impersonateUrl, adminUserData, {}, adminTokenData);
  fillInput('email', targetUserEmail);
  clickButton('Impersonate');
  andThen(() => {
    findWithAssert(`header.navbar:contains('${adminUserName}')`);
    findWithAssert("div:contains('Error: Invalid grant')");
    assert.equal(find(`header.navbar:contains('${targetUserName}')`).length, 0, 'user is not in navbar');
    assert.equal(currentPath(), 'requires-authorization.settings.impersonate', 'remained in impersonation settings');
  });
});

test('Impersonate link is shown to superusers', function() {
  signInAndVisit('/settings', adminUserData, {}, adminTokenData);

  andThen(() => {
    expectLink(impersonateUrl);
  });
});

test('Impersonate link is not shown to regular users', function() {
  signInAndVisit('/settings', targetUserData);
  andThen(() => {
    expectNoLink(impersonateUrl);
  });
});
