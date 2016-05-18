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
  let currentTokenRequestCount = 0;

  stubRequest('get', '/current_token', function() {
    currentTokenRequestCount++;
    return this.success(createStubToken({}, user));
  });

  signIn(user, {}, { scope: "elevated" });
  andThen(() => { assert.equal(currentTokenRequestCount, 0); });
  andThen(() => { visit("/"); });
  andThen(() => { assert.equal(currentTokenRequestCount, 1); });
});

test("Visiting a URL that does not require elevation with a manage token does not trigger requests", function(assert) {
  let currentTokenRequestCount = 0;

  stubRequest('get', '/current_token', function() {
    currentTokenRequestCount++;
    return this.success(createStubToken({}, user));
  });

  signIn(user, {}, { scope: "manage" });
  andThen(() => { visit("/"); });
  andThen(() => { assert.equal(currentTokenRequestCount, 0); });
});

test("Persisting an elevated token does not kill the UI", function(assert) {
  let currentTokenRequestCount = 0;

  stubRequest('get', '/current_token', function() {
    currentTokenRequestCount++;
    return this.success(createStubToken({ scope: "elevated" }, user));
  });

  signIn(user, {}, { scope: "elevated" });
  andThen(() => { visit("/"); });
  andThen(() => { assert.equal(currentTokenRequestCount, 1); });
});
