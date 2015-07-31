import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { stubRequest } from 'diesel/tests/helpers/fake-server';

let application;
let orgId = 'o1'; // FIXME this is hardcoded to match the value for signIn in aptible-helpers
let url = `/organizations/${orgId}/environments/new`;

module('Acceptance: Organizations: Environments: New', {
  beforeEach: function() {
    application = startApp();
    stubOrganization({ id:orgId });
    stubBillingDetail({ id:orgId, plan: 'production'});
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${url} requires authentication`, () => {
  expectRequiresAuthentication(url);
});

test(`visiting ${url} shows form to create new environment`, (assert) => {
  signInAndVisit(url);
  andThen(() => {
    assert.equal(currentPath(), 'dashboard.organization.environments.new');
    expectButton('Save environment');
    expectButton('Cancel');
    expectFocusedInput('environment-handle');
    // FIXME: expectToggle
  });
});

test(`visiting ${url} and creating new environment`, (assert) => {
  const handle = 'some-handle';

  stubRequest('get', `/accounts`, function(){
    return this.success({
      _embedded: {
      }
    });
  });

  stubRequest('post', `/accounts`, function(request){
    assert.ok(true, 'posts to /accounts');
    let json = this.json(request);
    assert.equal(json.handle, handle, 'has handle');
    assert.equal(json.type, 'development', 'dev env');
    return this.success({
      id: handle,
      handle
    });
  });

  signInAndVisit(url);
  andThen(() => {
    fillInput('environment-handle', handle);
    clickButton('Save environment');
  });
  andThen(() => {
    assert.equal(currentPath(), 'dashboard.organization.environments.index');
  });
});

test(`visiting ${url} and creating new prod environment`, (assert) => {
  const handle = 'some-handle';

  stubRequest('get', `/accounts`, function(){
    return this.success({
      _embedded: {
      }
    });
  });

  stubRequest('post', `/accounts`, function(request){
    assert.ok(true, 'posts to /accounts');
    let json = this.json(request);
    assert.equal(json.handle, handle, 'has handle');
    assert.equal(json.type, 'production', 'prod env');
    return this.success({
      id: handle,
      handle
    });
  });

  signInAndVisit(url);
  andThen(() => {
    fillInput('environment-handle', handle);
    check('environment-phi');
    clickButton('Save environment');
  });
  andThen(() => {
    assert.equal(currentPath(), 'dashboard.organization.environments.index');
  });
});
