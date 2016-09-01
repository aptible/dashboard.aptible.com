import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;
let url = '/stacks/my-stack-1/databases/new';
let dbIndexUrl = '/stacks/my-stack-1/databases';
let stackId = 'my-stack-1';
let stackHandle = 'my-stack-1';

module('Acceptance: Database Create', {
  beforeEach: function() {
    App = startApp();
    stubStack({
      id: stackId,
      handle: stackHandle,
      _links: {
        databases: { href: `/accounts/${stackId}/databases` },
        organization: { href: '/organizations/1' }
      }
    });
    stubOrganizations();
    stubOrganization();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

function findDatabase(dbName){
  return find(`.database-handle:contains(${dbName})`);
}

test(`visit ${url} requires authentication`, function() {
  expectRequiresAuthentication(url);
});

test(`visiting /stacks/:stack_id/databases without any databases redirects to ${url}`, function(assert) {
  let stack = {
    id: stackId,
    _links: { organization: { href: '/organizations/1' } }
  };
  stubStacks({}, [stack]);
  stubStack(stack);
  stubOrganization();
  stubDatabaseImages();
  signInAndVisit(`/stacks/${stackId}/databases`);

  andThen(function() {
    assert.equal(currentPath(), 'enclave.stack.databases.new');
  });
});

test(`visit ${url} when stack has no databases does not show cancel`, function(assert) {
  let stack = {
    id: stackId,
    _links: { organization: { href: '/organizations/1' } }
  };
  stubStacks({}, [stack]);
  stubStack(stack);
  stubDatabaseImages();
  stubRequest('get', '/accounts/my-stack-1/databases', function(){
    return this.success({
      _links: {},
      _embedded: {
        databases: []
      }
    });
  });
  stubOrganization();
  signInAndVisit(url);

  andThen(function() {
    assert.equal(currentPath(), 'enclave.stack.databases.new');
    let button = findButton('Cancel');
    assert.ok(!button.length, 'has no cancel button');
  });
});

test(`visit ${url} shows basic info`, function(assert) {
  let stack = {
    id: stackId,
    handle: stackHandle,
    _links: { organization: { href: '/organizations/1' } }
  };
  stubStacks({ includeDatabases: true });
  stubStack(stack);
  stubDatabaseImages();
  stubOrganization();
  signInAndVisit(url);

  andThen(function(){
    assert.equal(currentPath(), 'enclave.stack.databases.new');

    expectInput('handle');
    expectInput('databaseImage');
    expectFocusedInput('handle');
    expectButton('Save Database');
    expectButton('Cancel');

    var dbTypeSelector = findWithAssert('.database-select');
    assert.ok(dbTypeSelector.length, 'has db type selector');

    var dbTypes = find('.select-option', dbTypeSelector);
    assert.ok(dbTypes.length > 1, 'has at least 1 selectable db type');

    ['Redis', 'MySQL', 'PostgreSQL', 'RabbitMQ'].forEach(function(dbType){
      assert.ok( find('.select-option[title="' + dbType + '"]', dbTypeSelector).length,
          'has db type selector for ' + dbType);
    });

    var diskSizeSlider = findWithAssert('.slider.disk-size');
    assert.ok(diskSizeSlider.length, 'has disk size slider');

    expectTitle(`Create a Database - ${stackHandle}`);
  });
});

test(`visit ${url} and create`, function(assert) {
  assert.expect(7);

  var dbHandle = 'my-new-db',
      dbId = 'mydb-id',
      diskSize = 10;

  stubDatabaseImages([{
    id: 1,
    dockerRepo: 'quay.io/aptible/redis:3.0',
    description: 'redis 3.0',
    type: 'redis',
    default: true
  }]);

  // Just needed to stub /stack/my-stack-1/databases
  stubStacks({ includeDatabases: true });
  // stubStack({
  //   id: stackId,
  //   handle: 'stack-1',
  //   _links: { organization: { href: '/organizations/1' } }
  // });

  // get account (aka stack)
  stubRequest('get', '/accounts', function(){
    return this.success({
      _embedded: {
        accounts: [{
          id: 'my-stack-1',
          handle: 'stack-1',
          _links: {
            databases: { href: '/accounts/my-stack-1/databases' },
            organization: { href: '/organizations/1' }
          }
        }]
      }
    });
  });

  // get DB
  stubRequest('get', '/accounts/my-stack-1/databases', function(){
    return this.success({
      _embedded: {
        databases: [{
          id: dbId,
          handle: dbHandle,
          status: 'provisioned'
        }]
      }
    });
  });

  // create DB
  stubRequest('post', '/accounts/my-stack-1/databases', function(request){
    var json = this.json(request);
    assert.equal(json.handle, dbHandle, 'posts db handle');
    assert.equal(json.type, 'redis', 'posts db type of redis');
    assert.equal(json.database_image_id, 1, 'posts correct database image id');

    return this.success(201, {
      id: dbId,
      handle: dbHandle
    });
  });

  // create 'provision' operation with disk size
  stubRequest('post', '/databases/' + dbId + '/operations', function(request){
    var json = this.json(request);
    assert.equal(json.type, 'provision', 'posts type of provision');
    assert.equal(json.disk_size, diskSize, 'posts disk size');

    return this.success(201, {
      id: 'my-op-id',
      type: json.type,
      disk_size: json.disk_size,
      status: 'queued'
    });
  });

  stubRequest('post', '/claims/database', function(){
    return this.success({});
  });

  signInAndVisit(url);

  andThen(function(){
    fillInput('handle', dbHandle);
    click('.select-option[title="Redis"]');
    fillInput('databaseImage', 1);
    clickButton('Save Database');
  });

  // the disk size starts at 10GB
  // TODO test that moving the slider changes the disk size

  andThen(function(){
    assert.equal(currentPath(), 'enclave.stack.databases.index');

    assert.ok( findDatabase(dbHandle).length,
        'db list shows new db' );
  });
});

test(`visit ${url} with duplicate handle`, function(assert) {
  assert.expect(3);

  var dbHandle = 'my-new-db',
      dbId = 'mydb-id';

  stubDatabaseImages();

  // Just needed to stub /stack/my-stack-1/databases
  stubStacks({ includeDatabases: true });
  stubStack({ id: stackId, handle: 'stack-1'});

  // get account (aka stack)
  stubRequest('get', '/accounts', function(){
    return this.success({
      _embedded: {
        accounts: [{
          id: 'my-stack-1',
          handle: 'stack-1',
          _links: {
            databases: { href: '/accounts/my-stack-1/databases' },
            organization: { href: '/organizations/1' }
          }
        }]
      }
    });
  });

  // get DB
  stubRequest('get', '/accounts/my-stack-1/databases', function(){
    return this.success({
      _embedded: {
        databases: [{
          id: dbId,
          handle: dbHandle,
          status: 'provisioned'
        }]
      }
    });
  });

  stubRequest('post', '/claims/database', function(){
    return this.error();
  });

  signInAndVisit(url);

  andThen(() => { fillInput('handle', dbHandle); });

  andThen(function(){
    let submitButton = find('button:contains(Save Database)');
    assert.ok(submitButton.length, 'has submit button');
    assert.ok(submitButton.is(':disabled'), 'submit button is disabled');

    submitButton.click();
    assert.equal(currentPath(), 'enclave.stack.databases.new');
  });
});

test(`visit ${url} and click cancel button`, function(assert) {
  assert.expect(2);
  stubDatabaseImages();

  stubStacks({ includeDatabases: true});
  var dbHandle = 'my-new-db';

  signInAndVisit(url);
  andThen(function(){
    fillInput('handle', dbHandle);
    clickButton('Cancel');
  });
  andThen(function(){
    assert.equal(currentPath(), 'enclave.stack.databases.index');

    assert.ok( !findDatabase(dbHandle).length,
        'does not show database in list' );
  });
});

test(`diskSize is reset when leaving ${url} (#372)`, function(assert) {
  assert.expect(1);
  stubDatabaseImages();
  stubStacks({ includeDatabases: true});
  var diskSize = 30;

  signInAndVisit(url);
  andThen(function(){
    triggerSlider('.disk-size', diskSize);
    clickButton('Cancel');
  });
  visit(url);

  andThen(function() {
    let slider = find('.disk-size');

    assert.equal(slider.val(), '10.00');
  });
});

test(`visit ${url} and transition away`, function(assert) {
  assert.expect(2);
  stubDatabaseImages();

  stubStacks({ includeDatabases: true});
  var dbHandle = 'a-new-db-handle';

  signInAndVisit(url);
  andThen(function(){
    fillInput('handle', dbHandle);
    visit(dbIndexUrl);
  });
  andThen(function(){
    assert.equal(currentPath(), 'enclave.stack.databases.index');

    assert.ok( !findDatabase(dbHandle).length,
        'does not show database in list' );
  });
});

test(`visit ${url} when user is not verified shows "Cannot create" message`, function(assert) {
  let userData = {verified: false};
  stubDatabaseImages();
  stubStacks({ includeDatabases: true});
  signInAndVisit(url, userData);
  andThen( () => {
    expectNoButton('Save Database');
    expectNoButton('Cancel');
    let message = find('.activate-notice h1');
    assert.ok(message.text().indexOf('Cannot create a new database') > -1,
       'shows cannot create db message');
  });
});
