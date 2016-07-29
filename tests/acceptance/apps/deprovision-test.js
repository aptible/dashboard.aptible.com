import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;

module('Acceptance: App Deprovision', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('/apps/:id/deprovision requires authentication', function() {
  expectRequiresAuthentication('/apps/1/deprovision');
});

test('/apps/:id/deprovision will not deprovision without confirmation', function(assert) {
  var appId = 1;
  var appName = 'foo-bar';
  var stackHandle = 'krwee-zing';
  stubOrganizations();
  stubApp({
    id: appId,
    handle: appName,
    status: 'provisioned',
    _links: {
      account: { href: `/accounts/${stackHandle}` }
    }
  });
  stubStacks();
  stubStack({
    id: stackHandle,
    handle: stackHandle
  });

  signInAndVisit('/apps/'+appId+'/deprovision');
  andThen(function(){
    var button = findWithAssert('button:contains(Deprovision)');
    assert.ok(button.is(':disabled'), 'deprovision button is disabled');
    expectTitle(`Deprovision ${appName} - ${stackHandle}`);
  });
});

test('/apps/:id/deprovision will deprovision with confirmation', function(assert) {
  var appId = 1;
  var appName = 'foo-bar';
  var didDeprovision = false;
  stubStacks();
  stubStack({id: '1'});

  stubApp({
    id: appId,
    handle: appName,
    status: 'provisioned',
    _links: {
      account: {href: '/accounts/1'},
      self: {href: `/apps/${appId}` }
    }
  });

  stubRequest('post', `/apps/${appId}/operations`, function(){
    didDeprovision = true;
    return this.success({
      id: '1',
      status: 'queued',
      type: 'deprovision'
    });
  });

  stubStacks();
  stubOrganization();
  stubOrganizations();

  signInAndVisit(`/apps/${appId}/deprovision`);
  fillIn('input[type=text]', appName);
  andThen(function(){
    $('input[type=text]').trigger('input');
  });
  click('button:contains(Deprovision)');
  andThen(function(){
    assert.ok(didDeprovision, 'deprovisioned');
    assert.equal(currentPath(), 'dashboard.catch-redirects.stack.apps.index');
  });
});

test('/apps/:id/deprovision will show deprovision error', function(assert) {
  var appId = 1;
  var appName = 'foo-bar';
  var errorMessage = 'Some bad error';
  stubStacks();
  stubStack({id: '1'});
  stubOrganizations();

  stubApp({
    id: appId,
    handle: appName,
    status: 'provisioned',
    _links: {
      account: {href: '/accounts/1'}
    }
  });

  stubRequest('post', '/apps/'+appId+'/operations', function(){
    return this.error(401, {
      code: 401,
      error: 'invalid_credentials',
      message: errorMessage
    });
  });

  signInAndVisit(`/apps/${appId}/deprovision`);
  fillIn('input[type=text]', appName);
  andThen(function(){
    $('input[type=text]').trigger('input');
  });
  click('button:contains(Deprovision)');
  andThen(function(){
    var error = findWithAssert('.alert');
    assert.ok(error.text().indexOf(errorMessage) > -1, 'error message shown');
    assert.equal(currentPath(), 'dashboard.catch-redirects.app.deprovision');
  });
});
