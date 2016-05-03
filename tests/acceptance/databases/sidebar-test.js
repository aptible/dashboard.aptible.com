import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;
let databaseId = 'my-db-1-stack-1';

module('Acceptance: Database Sidebar', {
  beforeEach: function() {
    App = startApp();
    stubStacks({ includeApps: true, includeDatabases: true });
    stubStack({ id: 'my-stack-1' });
    stubOrganization();
    stubOrganizations();
    stubRequest('get', `/databases/${databaseId}`, function() {
      return this.success({
        id: databaseId,
        handle: 'my-app',
        status: 'provisioned',
        _links: {
          account: {href: '/accounts/my-stack-1'}
        },
        _embedded: {
          operations: []
        }
      });
    });
    stubRequest('get', `/databases/${databaseId}/operations`, function(){
      return this.success({
        _embedded: {
          operations: []
        }
      });
    });
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('is visible from database show page', function(assert) {
  signInAndVisit(`/databases/${databaseId}`);

  andThen(function() {
    assert.ok(find('.layout-sidebar'), 'it has a sidebar');
  });
});

test('includes breadcrumb to parent stack', function(assert) {
  signInAndVisit(`/databases/${databaseId}`);

  andThen(function() {
    let stackHandle = find(`h3:contains(${stackHandle})`);
    assert.ok(stackHandle, 'has stack link');
    click('.back-to-stack');
  });

  andThen(function() {
    assert.equal(currentPath(), 'dashboard.requires-read-access.stack.apps.index');
  });
});

test('lists all apps under parent stack', function(assert) {
  signInAndVisit(`/databases/${databaseId}`);

  andThen(function() {
    assert.ok(find('li a:contains(my-app-1-stack-1)'), 'has link to app 1');
    assert.ok(find('li a:contains(my-app-2-stack-1)'), 'has link to app 2');
  });
});

test('lists all databases under parent stack', function(assert) {
  signInAndVisit(`/databases/${databaseId}`);

  andThen(function() {
    assert.ok(find('li a:contains(my-db-1-stack-1)'), 'has link to db 1');
    assert.ok(find('li a:contains(my-db-2-stack-1)'), 'has link to db 2');
  });
});

test('indicates current app with active class', function(assert) {
  signInAndVisit(`/databases/${databaseId}`);

  andThen(function() {
    assert.ok(find('li.active a:contains(my-app-1-stack-1)'), 'has link to app 1');
  });
});
