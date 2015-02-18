import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;
let url = '/stacks/1/databases/new';
let dbIndexUrl = '/stacks/1/databases';
let stackId = 1;

module('Acceptance: Database Create', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

function findDatabase(dbName){
  return find(`.database-handle:contains(${dbName})`);
}

test(`visit ${url} requires authentication`, function(){
  expectRequiresAuthentication(url);
});

test(`visit ${url} shows fields for creating a db`, function(){
  let stackHandle = 'my-cool-handle';
  stubStack({id: stackId, handle: stackHandle});
  stubOrganization();

  signInAndVisit(url);

  andThen(function(){
    equal(currentPath(), 'stack.databases.new');

    expectInput('handle');
    expectButton('Save Database');
    expectButton('Cancel');

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

    titleUpdatedTo(`Create a Database - ${stackHandle}`);
  });
});

test(`visit ${url} and create`, function(){
  expect(6);

  var dbHandle = 'my-new-db',
      dbId = 'mydb-id',
      diskSize = 10;

  // Just needed to stub /stack/my-stack-1/databases
  stubStacks({ includeDatabases: true });
  stubStack({ id: stackId, handle: 'stack-1'});

  // get account (aka stack)
  stubRequest('get', '/accounts', function(request){
    return this.success({
      _embedded: {
        accounts: [{
          id: 'my-stack-1',
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

  signInAndVisit(url);

  andThen(function(){
    fillIn( findInput('handle'), dbHandle );
    click('.select-option[title="Redis"]');
    click( findButton('Save Database') );
  });

  // the disk size starts at 10GB
  // TODO test that moving the slider changes the disk size

  andThen(function(){
    equal(currentPath(), 'stack.databases.index');

    ok( findDatabase(dbHandle).length,
        'db list shows new db' );
  });
});

test(`visit ${url} and click cancel button`, function(){
  expect(2);

  var dbHandle = 'my-new-db';

  stubStack({id: 1, handle:'stack-1'});

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

  stubRequest('get', '/accounts/1/databases', function(request){
    return this.success({
      _embedded: {
        databases: []
      }
    });
  });

  signInAndVisit(url);
  andThen(function(){
    fillIn( findInput('handle'), dbHandle );
    click( findButton('Cancel') );
  });
  andThen(function(){
    equal(currentPath(), 'stack.databases.index');

    ok( !findDatabase(dbHandle).length,
        'does not show database in list' );
  });
});

test(`visit ${url} and transition away`, function(){
  expect(2);

  var dbHandle = 'a-new-db-handle';

  stubStack({id: 1, handle:'stack-1'});

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

  stubRequest('get', '/accounts/1/databases', function(request){
    return this.success({
      _embedded: { databases: [] }
    });
  });

  signInAndVisit(url);
  andThen(function(){
    fillIn( findInput('handle'), dbHandle );
    visit(dbIndexUrl);
  });
  andThen(function(){
    equal(currentPath(), 'stack.databases.index');

    ok( !findDatabase(dbHandle).length,
        'does not show database in list' );
  });
});
