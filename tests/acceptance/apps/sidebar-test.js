import Ember from 'ember';
import {module, test, skip} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;
let appId = 'my-app-1-stack-1';
let stackId = 'my-stack-1';

module('Acceptance: App Sidebar', {
  beforeEach: function() {
    App = startApp();
    stubStacks({ includeApps: true, includeDatabases: true });
    stubStack({ id: stackId });
    stubOrganization();
    stubRequest('get', '/users/user1/ssh_keys', function(){
      return this.success({
        _embedded: {
          ssh_keys: []
        }
      });
    });
    stubRequest('get', `/apps/${appId}`, function() {
      return this.success({
        id: appId,
        handle: 'my-app',
        status: 'provisioned',
        _links: {
          account: {href: '/accounts/my-stack-1'}
        },
        _embedded: {
          services: [],
          lastDeployOperation: {
            id: 'op-1',
            user_name: 'test user',
            git_ref: 'not-the-current-git-ref',
            created_at: '2015-02-15T19:39:11Z' // iso8601
          }
        }
      });
    });
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('is visible from app show page', function(assert) {
  signInAndVisit(`/apps/${appId}`);

  andThen(function() {
    assert.hasElement('.layout-sidebar', 'it has a sidebar');
  });
});

test('includes breadcrumb to parent stack', function(assert) {
  signInAndVisit(`/apps/${appId}`);

  andThen(function() {
    assert.hasElement(`h3:contains(${stackId})`, 'has stack link');
    click('.back-to-stack');
  });

  andThen(function() {
    assert.equal(currentPath(), 'requires-authorization.enclave.stack.apps.index');
  });
});

test('lists all apps under parent stack', function(assert) {
  signInAndVisit(`/apps/${appId}`);

  andThen(function() {
    assert.hasElement('li a:contains(my-app-1-stack-1)', 'has link to app 1');
    assert.hasElement('li a:contains(my-app-2-stack-1)', 'has link to app 2');
  });
});

test('lists all databases under parent stack', function(assert) {
  signInAndVisit(`/apps/${appId}`);

  andThen(function() {
    assert.hasElement('li a:contains(my-db-1-stack-1)', 'has link to db 1');
    assert.hasElement('li a:contains(my-db-2-stack-1)', 'has link to db 2');
  });
});

// REVIEW: This test was inadvertently a false positive before. But it should
// be made to pass.
skip('indicates current app with active class', function(assert) {
  signInAndVisit(`/apps/${appId}`);

  andThen(function() {
    assert.hasElement('li.active a:contains(my-app-1-stack-1)', 'has link to app 1');
  });
});
