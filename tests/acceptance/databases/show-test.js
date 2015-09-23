import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;

module('Acceptance: Databases Show', {
  beforeEach: function() {
    App = startApp();
    stubOrganizations();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /databases/:id requires authentication', function() {
  expectRequiresAuthentication('/databases/1');
});

test('visiting /databases/my-db-id shows the database', function(assert) {
  stubStack({ id: 'my-stack-1' });
  stubRequest('get', '/databases/my-db-id', function(){
    return this.success({
      id: 'my-db-id',
      handle: 'my-database',
      _links: {
        account: { href: '/accounts/my-stack-1' }
      }
    });
  });

  stubRequest('get', '/databases/my-db-id/operations', function(){
    return this.success({
      _embedded: {
        operations: []
      }
    });
  });

  signInAndVisit('/databases/my-db-id');
  andThen(function() {
    assert.equal(currentPath(), 'dashboard.database.activity', 'show page is visited');
    var contentNode = findWithAssert('*:contains(my-database)');
    assert.ok(contentNode.length > 0, 'my-database is on the page');
  });
});

test('visiting /databases/my-db-id with provisioned database and disk shows disk size', function(assert) {
  stubStack({ id: 'my-stack-1' });
  stubRequest('get', '/databases/my-db-id', function(){
    return this.success({
      id: 'my-db-id',
      handle: 'my-database',
      status: 'provisioned',
      connectionUrl: 'postgresql://me:pw@10.0.0.0/db',
      _links: {
        account: { href: '/accounts/my-stack-1' },
        disk: { href: '/disks/my-disk-1' }
      }
    });
  });

  stubRequest('get', '/disks/my-disk-1', function(){
    return this.success({
      id: 'my-disk-1',
      size: 10,
      _links: {
        database: { href: '/disks/my-db-id' }
      }
    });
  });

  stubRequest('get', '/databases/my-db-id/operations', function(){
    return this.success({
      _embedded: {
        operations: []
      }
    });
  });

  signInAndVisit('/databases/my-db-id');
  andThen(function() {
    assert.equal(currentPath(), 'dashboard.database.activity', 'show page is visited');
    var sizeNode = findWithAssert('.db-size:contains(10 GB)');
    var urlNode = findWithAssert('.db-connection-url:contains(postgresql://me:pw@10.0.0.0/db)');
    assert.ok(sizeNode.length > 0, 'shows database size');
    assert.ok(urlNode.length > 0, 'shows database connection url');
  });
});

test('visiting /databases/my-db-id with provisioning database shows a spinner', function(assert) {
  stubStack({ id: 'my-stack-1' });
  stubRequest('get', '/databases/my-db-id', function(){
    return this.success({
      id: 'my-db-id',
      handle: 'my-database',
      status: 'provisioning',
      _links: {
        account: { href: '/accounts/my-stack-1' }
      }
    });
  });

  stubRequest('get', '/databases/my-db-id/operations', function(){
    return this.success({
      _embedded: {
        operations: []
      }
    });
  });

  signInAndVisit('/databases/my-db-id');
  andThen(function() {
    assert.equal(currentPath(), 'dashboard.database.activity', 'show page is visited');
    var contentNode = findWithAssert('.db-status:contains(Provisioning)');
    assert.ok(contentNode.length > 0, 'shows provisioning status');
  });
});

test('visiting /databases/my-db-id with provisioned database but no disk doesn\'t show size', function(assert) {
  stubStack({ id: 'my-stack-1' });
  stubRequest('get', '/databases/my-db-id', function(){
    return this.success({
      id: 'my-db-id',
      handle: 'my-database',
      status: 'provisioned',
      _links: {
        account: { href: '/accounts/my-stack-1' }
      }
    });
  });

  stubRequest('get', '/databases/my-db-id/operations', function(){
    return this.success({
      _embedded: {
        operations: []
      }
    });
  });

  signInAndVisit('/databases/my-db-id');
  andThen(function() {
    assert.equal(currentPath(), 'dashboard.database.activity', 'show page is visited');
    var contentNode = find('.db-size');
    assert.ok(contentNode.length === 0, 'my-database is on the page');
  });
});
