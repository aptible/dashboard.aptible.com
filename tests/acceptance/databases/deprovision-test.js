import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;

module('Acceptance: Database Deprovision', {
  beforeEach: function() {
    App = startApp();
    stubOrganizations();
    stubStacks();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('/databases/:id/deprovision requires authentication', function() {
  expectRequiresAuthentication('/databases/1/deprovision');
});

test('/databases/:id/deprovision will not deprovision without confirmation', function(assert) {
  var databaseId = 1;
  var databaseName = 'foo-bar';
  var stackHandle = 'rrriggi';

  stubDatabase({
    id: databaseId,
    handle: databaseName,
    _links: {
      stack: { href: `/accounts/${stackHandle}` }
    }
  });

  stubStack({
    id: stackHandle,
    handle: stackHandle
  });

  signInAndVisit('/databases/'+databaseId+'/deprovision');
  andThen(function(){
    var button = findWithAssert('button:contains(Deprovision)');
    assert.ok(button.is(':disabled'), 'deprovision button is disabled');
    expectTitle(`Deprovision ${databaseName} - ${stackHandle}`);
  });
});

test('/databases/:id/deprovision will deprovision with confirmation', function(assert) {
  let databaseId = 1;
  let databaseName = 'foo-bar';
  let didDeprovision = false;

  stubStack({ id: '1' });

  stubDatabase({
    id: databaseId,
    handle: databaseName,
    _links: {
      account: {href: '/accounts/1'},
      self: {href: `/databases/${databaseId}`}
    }
  });

  stubRequest('post', `/databases/${databaseId}/operations`, function(){
    didDeprovision = true;
    return this.success({
      id: '1',
      status: 'queued',
      type: 'deprovision'
    });
  });

  stubStacks();
  stubOrganization();

  signInAndVisit(`/databases/${databaseId}/deprovision`);

  andThen(function(){
    fillIn('input[type=text]', databaseName);
  });
  andThen(function(){
    $('input[type=text]').trigger('input');
  });
  click('button:contains(Deprovision)');
  andThen(() => {
    assert.ok(didDeprovision, 'deprovisioned', 'received successful response');
    assert.equal(currentPath(), 'dashboard.requires-read-access.stack.databases.new',
      'with no dbs, user is routed to create one');
  });
});

test('/databases/:id/deprovision will show deprovision error', function(assert) {
  var databaseId = 1;
  var databaseName = 'foo-bar';
  var errorMessage = 'Some bad error';

  stubStack({id: '1'});

  stubDatabase({
    id: databaseId,
    handle: databaseName,
    _links: {
      account: {href: '/accounts/1'}
    }
  });

  stubRequest('post', '/databases/'+databaseId+'/operations', function(){
    return this.error(401, {
      code: 401,
      error: 'invalid_credentials',
      message: errorMessage
    });
  });

  signInAndVisit('/databases/'+databaseId+'/deprovision');
  fillIn('input[type=text]', databaseName);
  andThen(function(){
    $('input[type=text]').trigger('input');
  });
  click('button:contains(Deprovision)');
  andThen(function(){
    var error = findWithAssert('.alert');
    assert.ok(error.text().indexOf(errorMessage) > -1, 'error message shown');
    assert.equal(currentPath(), 'dashboard.requires-read-access.database.deprovision');
  });
});
