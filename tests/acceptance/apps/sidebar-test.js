import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;
let appId = 'my-app-1-stack-1';
let stackHandle = 'my-stack-1';

module('Acceptance: App Sidebar', {
  setup: function() {
    App = startApp();
    stubStacks({ includeApps: true, includeDatabases: true });
    stubStack({ id: 'my-stack-1' });
    stubOrganization();
    stubOrganizations();
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
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('is visible from app show page', function() {
  signInAndVisit(`/apps/${appId}`);

  andThen(function() {
    ok(find('.layout-sidebar'), 'it has a sidebar');
  });
});

test('includes breadcrumb to parent stack', function() {
  signInAndVisit(`/apps/${appId}`);

  andThen(function() {
    let stackHandle = find(`h3:contains(${stackHandle})`);
    ok(stackHandle, 'has stack link');
    click('.back-to-stack');
  });

  andThen(function() {
    equal(currentPath(), 'stack.apps.index');
  });
});

test('lists all apps under parent stack', function() {
  signInAndVisit(`/apps/${appId}`);

  andThen(function() {
    ok(find('li a:contains(my-app-1-stack-1)'), 'has link to app 1');
    ok(find('li a:contains(my-app-2-stack-1)'), 'has link to app 2');
  });
});

test('lists all databases under parent stack', function() {
  signInAndVisit(`/apps/${appId}`);

  andThen(function() {
    ok(find('li a:contains(my-db-1-stack-1)'), 'has link to db 1');
    ok(find('li a:contains(my-db-2-stack-1)'), 'has link to db 2');
  });
});

test('indicates current app with active class', function() {
  signInAndVisit(`/apps/${appId}`);

  andThen(function() {
    ok(find('li.active a:contains(my-app-1-stack-1)'), 'has link to app 1');
  });
});
