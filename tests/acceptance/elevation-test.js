import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

let App;
let user;

module('Acceptance: Elevation', {
  beforeEach: function() {
    App = startApp();
    user = createStubUser();
    stubUser(user);
    stubStacks();
    stubOrganizations();
    stubOrganization({ id: 'o1'});
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test("Visiting an URL requiring elevation with an elevated token does not redirect", function(assert) {
  signIn(user, {}, { scope: "elevated" });

  andThen(() => { visit("/settings/protected/admin"); });
  andThen(() => {
    assert.equal(currentPath(), "dashboard.settings.requires-elevation.admin");
  });
});

test("Visiting an URL requiring elevation with a manage token redirects to /elevate", function(assert) {
  signIn(user, {}, { scope: "manage" });

  andThen(() => { visit("/settings/protected/admin"); });
  andThen(() => {
    assert.equal(currentPath(), "elevate");
  });
});

test("Visiting a URL that does not require elevation with an elevated token clears it", function(assert) {
  signIn(user, {}, { scope: "elevated" });

  let currentTokenRequestCount = 0;
  stubRequest('get', '/current_token', function() {
    currentTokenRequestCount++;
    return this.success(createStubToken({}, user));
  });

  andThen(() => { assert.equal(currentTokenRequestCount, 0); });
  andThen(() => { visit("/"); });
  andThen(() => { assert.equal(currentTokenRequestCount, 1); });
});

test("Visiting a URL that does not require elevation with a manage token does not trigger requests", function(assert) {
  signIn(user, {}, { scope: "manage" });

  let currentTokenRequestCount = 0;
  stubRequest('get', '/current_token', function() {
    currentTokenRequestCount++;
    return this.success(createStubToken({}, user));
  });

  andThen(() => { visit("/"); });
  andThen(() => { assert.equal(currentTokenRequestCount, 1); });
  andThen(() => { visit("/settings/profile"); });
  andThen(() => { assert.equal(currentTokenRequestCount, 1); });
});

test("Persisting an elevated token does not kill the UI", function(assert) {
  signIn(user, {}, { scope: "elevated" });

  let currentTokenRequestCount = 0;
  stubRequest('get', '/current_token', function() {
    currentTokenRequestCount++;
    return this.success(createStubToken({ scope: "elevated" }, user));
  });

  andThen(() => { visit("/"); });
  andThen(() => { assert.equal(currentTokenRequestCount, 1); });
});

test("Submitting the elevation form requires an elevated token, and does not destroy the current token", function(assert) {
  assert.expect(6);

  const userEmail = "foo@example.com";
  const userPassword = "bar";
  const user = createStubUser({ email: userEmail, password: userPassword });

  let createTokenRequestCount = 0;

  stubRequest('post', '/tokens', function(request) {
    const params = this.json(request);
    assert.ok(!request.withCredentials, "The token will not be persisted to cookies");
    assert.equal(params.username, userEmail, "Email is valid");
    assert.equal(params.password, userPassword, "Password is valid");
    assert.equal(params.scope, "elevated", "Scope is elevated");
    assert.ok(params.expires_in < 3600, "Token expires in less than an hour");
    createTokenRequestCount++;
    return this.success(createStubToken({ scope: "elevated" }, user));
  });

  signIn(user, {}, { scope: "manage" });

  andThen(() => { visit("/settings/protected/admin"); });
  andThen(() => {
    fillInput("password", userPassword);
    clickButton("Confirm");
  });

  andThen(() => {
    assert.equal(createTokenRequestCount, 1, "A single request was made to create a token");
  });
});
