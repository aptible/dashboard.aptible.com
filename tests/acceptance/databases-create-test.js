import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App;

module('Acceptance: Database New', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit /stacks/1/databases/new requires authentication', function(){
  expectRequiresAuthentication('/stacks/1/databases/new');
});

test('visit /stacks/1/databases/new shows fields for creating a db', function(){
  var stackId = '1';
  stubStacks();

  signInAndVisit('/stacks/' + stackId + '/databases/new');

  andThen(function(){
    equal(currentPath(), 'stacks.stack.databases.new');

    var input = findWithAssert('input[name="handle"]');
    ok(input.length, 'has database handle input');

    var button = findWithAssert('button:contains(Create Database)');
    ok(button.length, 'has create button');

    var cancelButton = findWithAssert('button:contains(Nevermind)');
    ok(cancelButton.length, 'has cancel button');

    var dbTypeSelector = findWithAssert('.database-select');
    ok(dbTypeSelector.length, 'has db type selector');

    var dbTypes = find('.select-option', dbTypeSelector);
    ok(dbTypes.length > 1, 'has at least 1 selectable db type');

    ['Redis', 'MySQL', 'PostgreSQL'].forEach(function(dbType){
      ok( find('.select-option[title="' + dbType + '"]', dbTypeSelector).length,
          'has db type selector for ' + dbType);
    });

    var diskSizeSlider = findWithAssert('.slider.disk-size');
    ok(diskSizeSlider.length, 'has disk size slider');
  });
});

test('visit /stacks/1/databases/new and create', function(){
  expect(6);

  var dbHandle = 'my-new-db',
      dbId = 'mydb-id',
      diskSize = 10;

  stubStack({id: 1, handle:'stack-1'});

  // get account (aka stack)
  stubRequest('get', '/accounts', function(request){
    return this.success({
      _embedded: {
        accounts: [{
          id: '1',
          handle: 'stack-1',
          _links: {
            databases: { href: '/accounts/1/databases' }
          }
        }]
      }
    });
  });

  // get DB
  stubRequest('get', '/accounts/1/databases', function(request){
    return this.success({
      _embedded: {
        databases: [{
          id: dbId,
          handle: dbHandle
        }]
      }
    });
  });

  // create DB
  stubRequest('post', '/accounts/1/databases', function(request){
    var json = JSON.parse(request.requestBody);
    equal(json.handle, dbHandle, 'posts db handle');
    equal(json.type, 'redis', 'posts db type of redis');

    return this.success(201, {
      id: dbId,
      handle: dbHandle
    });
  });

  // create 'provision' operation with disk size
  stubRequest('post', '/databases/' + dbId + '/operations', function(request){
    var json = JSON.parse(request.requestBody);
    equal(json.type, 'provision', 'posts type of provision');
    equal(json.disk_size, diskSize, 'posts disk size');

    return this.success(201, {
      id: 'my-op-id',
      type: json.type,
      disk_size: json.disk_size,
      status: 'queued'
    });
  });

  signInAndVisit('/stacks/1/databases/new');

  // the existence of these fields/selectors is asserted in a previous test
  fillIn('input[name="handle"]', dbHandle);
  click('.select-option[title="Redis"]');
  click(':contains(Create Database)');

  // the disk size starts at 10GB
  // TODO test that moving the slider changes the disk size

  andThen(function(){
    equal(currentPath(), 'stacks.stack.databases.index');

    ok(find(':contains(' + dbHandle + ')').length, 'has new db handle');
  });
});

test('visit /stacks/1/databases/new and cancel', function(){
  expect(1);

  var dbHandle = 'my-new-db';

  stubStack({id: 1, handle:'stack-1'});

  // get account (aka stack)
  stubRequest('get', '/accounts', function(request){
    return this.success({
      _embedded: {
        accounts: [{
          id: '1',
          handle: 'stack-1',
          _links: {
            databases: { href: '/accounts/1/databases' }
          }
        }]
      }
    });
  });

  // get DB
  stubRequest('get', '/accounts/1/databases', function(request){
    return this.success({
      _embedded: {
        databases: [{
          id: 'my-new-db-id',
          handle: 'my-new-db'
        }]
      }
    });
  });

  signInAndVisit('/stacks/1/databases/new');

  click(':contains(Nevermind)');

  andThen(function(){
    equal(currentPath(), 'stacks.stack.databases.index');
  });
});
