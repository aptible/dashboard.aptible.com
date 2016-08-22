import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../../../helpers/start-app';
import { stubRequest } from '../../../helpers/fake-server';

let application;
let orgId = 1; // FIXME this is hardcoded to match the value for signIn in aptible-helpers
let url = `/organizations/${orgId}/environments/new`;

var setupBillingDetail = function(plan='production') {
  stubBillingDetail({ id:orgId, plan: plan});
};

module('Acceptance: Organizations: Environments: New', {
  beforeEach: function() {
    application = startApp();
    stubOrganizations();
    stubOrganization({ id:orgId });
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${url} requires authentication`, () => {
  setupBillingDetail();
  expectRequiresAuthentication(url);
});

test(`visiting ${url} shows form to create new environment`, (assert) => {
  setupBillingDetail();
  stubStacks();
  signInAndVisit(url);
  andThen(() => {
    assert.equal(currentPath(), 'dashboard.catch-redirects.organization.environments.new');
    expectButton('Save environment');
    expectButton('Cancel');
    expectFocusedInput('environment-handle');
    // FIXME: expectToggle
  });
});

test(`visiting ${url} and creating new environment`, (assert) => {
  const handle = 'some-handle';

  setupBillingDetail();

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

  stubRequest('post', '/claims/account', function(){
    return this.success({});
  });

  signInAndVisit(url);
  andThen(() => {
    fillInput('environment-handle', handle);
    clickButton('Save environment');
  });
  andThen(() => {
    assert.equal(currentPath(), 'dashboard.catch-redirects.organization.environments.index');
  });
});

test(`visiting ${url} and with duplicate handle`, (assert) => {
  const handle = 'some-handle';

  setupBillingDetail();

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

  stubRequest('post', '/claims/account', function(){
    return this.error();
  });

  signInAndVisit(url);
  andThen(() => { fillInput('environment-handle', handle); });
  andThen(() => {
    let submitButton = find('button:contains(Save environment)');
    assert.ok(submitButton.length, 'has submit button');
    assert.ok(submitButton.is(':disabled'), 'submit is disabled');

    clickButton('Save environment');
  });
  andThen(() => {
    //Still on new page
    assert.equal(currentPath(), 'dashboard.catch-redirects.organization.environments.new');
  });
});

test(`visiting ${url} and creating new prod environment`, (assert) => {
  const handle = 'some-handle';

  setupBillingDetail();

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

  stubRequest('post', '/claims/account', function(){
    return this.success({});
  });

  signInAndVisit(url);
  andThen(() => {
    fillInput('environment-handle', handle);
    check('environment-phi');
    clickButton('Save environment');
  });
  andThen(() => {
    assert.equal(currentPath(), 'dashboard.catch-redirects.organization.environments.index');
  });
});

test(`Creating a new environment with non-phi plan offers a link to upgrade`, (assert) => {
  const handle = 'some-handle';

  setupBillingDetail('development');

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
    assert.equal(json.type, 'development', 'development env');
    return this.success({
      id: handle,
      handle
    });
  });

  stubRequest('post', '/claims/account', function(){
    return this.success({});
  });

  signInAndVisit(url);
  andThen(() => {
    fillInput('environment-handle', handle);
    assert.ok(find('.form-group a[href*="contact.aptible.com"]:contains(Contact support to upgrade to PHI ready plan.)').length);
    clickButton('Save environment');
  });
  andThen(() => {
    assert.equal(currentPath(), 'dashboard.catch-redirects.organization.environments.index');
  });
});
