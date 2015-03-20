import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;

module('Acceptance: Database Deprovision', {
  setup: function() {
    App = startApp();
    stubOrganizations();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('/databases/:id/deprovision requires authentication', function(){
  expectRequiresAuthentication('/databases/1/deprovision');
});

test('/databases/:id/deprovision will not deprovision without confirmation', function(){
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
    ok(button.is(':disabled'), 'deprovision button is disabled');
  });
  titleUpdatedTo(`Deprovision ${databaseName} - ${stackHandle}`);
});

test('/databases/:id/deprovision will deprovision with confirmation', function(){
  var databaseId = 1;
  var databaseName = 'foo-bar';
  var didDeprovision = false;

  stubStack({id: '1'});

  stubDatabase({
    id: databaseId,
    handle: databaseName,
    _links: {
      account: {href: '/accounts/1'}
    }
  });

  stubRequest('post', '/databases/'+databaseId+'/operations', function(request){
    didDeprovision = true;
    return this.success({
      id: '1',
      status: 'queued',
      type: 'deprovision'
    });
  });

  stubStacks();
  stubOrganization();

  signInAndVisit('/databases/'+databaseId+'/deprovision');
  fillIn('input[type=text]', databaseName);
  andThen(function(){
    $('input[type=text]').trigger('input');
  });
  click('button:contains(Deprovision)');
  andThen(function(){
    ok(didDeprovision, 'deprovisioned');
    equal(currentPath(), 'stack.databases.index');
  });
});

test('/databases/:id/deprovision will show deprovision error', function(){
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

  stubRequest('post', '/databases/'+databaseId+'/operations', function(request){
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
    ok(error.text().indexOf(errorMessage) > -1, 'error message shown');
    equal(currentPath(), 'database.deprovision');
  });
});
