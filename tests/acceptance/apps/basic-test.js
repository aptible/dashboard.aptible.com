import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App, server;

module('Acceptance: Apps', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    if (server) {
      server.shutdown();
    }
  }
});

test('visiting /stacks/1/apps requires authentication', function() {
  expectRequiresAuthentication('/stacks/1/apps');
});

test('visiting /stacks/my-stack-1/apps with no apps redirects to apps new', function() {
  stubStacks({ includeApps: false });
  stubStack({ id: 'my-stack-1' });
  stubOrganization();

  signInAndVisit('/stacks/my-stack-1/apps');
  andThen(function(){
    equal(currentPath(), 'stack.apps.new');
  });
});

test('visiting /stacks/my-stack-1/apps', function() {
  // This is needed to stub /stack/my-stack-1/apps
  stubStacks({ includeApps: true });
  stubStack({
    id: 'my-stack-1',
    handle: 'my-stack-1',
    _links: {
      apps: { href: '/accounts/my-stack-1/apps' },
      organization: { href: '/organizations/1' }
    }
  });
  stubOrganization();
  signInAndVisit('/stacks/my-stack-1/apps');

  andThen(function() {
    equal(currentPath(), 'stack.apps.index');
  });
  titleUpdatedTo('my-stack-1 Apps - Sprocket Co');
});

test('visiting /stacks/my-stack-1/apps shows list of apps', function() {
  // Just needed to stub /stack/my-stack-1/apps
  stubStacks({ includeApps: true });
  stubStack({
    id: 'my-stack-1',
    handle: 'my-stack-1',
    _links: {
      apps: { href: '/accounts/my-stack-1/apps' },
      organization: { href: '/organizations/1' }
    }
  });
  stubOrganization();
  signInAndVisit('/stacks/my-stack-1/apps');

  andThen(function() {
    var appRows = find('.panel.app');

    equal(appRows.length, 2, '2 apps');
  });
});

test('visiting /stacks/my-stack-1/apps then clicking on an app visits the app', function() {
  // Just needed to stub /stack/my-stack-1/apps
  stubStacks({ includeApps: true });
  stubStack({
    id: 'my-stack-1',
    handle: 'my-stack-1',
    _links: {
      apps: { href: '/accounts/my-stack-1/apps' }
    }
  });
  signInAndVisit('/stacks/my-stack-1/apps');

  andThen(function(){
    let appLink = expectLink("/apps/1");
    click(appLink);
  });

  andThen(function(){
    equal(currentPath(), 'app.services', 'app show page is visited');
  });
});

test('/stacks/my-stack-1/apps requests apps, databases on each visit', function() {
  var appRequestCount = 0;
  var databaseRequestCount = 0;
  stubStack({
    id: 'my-stack-1',
    _links: {
      databases: {href: '/accounts/my-stack-1/databases'},
      apps: {href: '/accounts/my-stack-1/apps'}
    }
  });
  stubRequest('get', '/accounts/my-stack-1/databases', function(request){
    databaseRequestCount++;
    return this.success({
      _links: {},
      _embedded: {
        databases: []
      }
    });
  });
  stubRequest('get', '/accounts/my-stack-1/apps', function(request){
    appRequestCount++;
    return this.success({
      _links: {},
      _embedded: {
        apps: []
      }
    });
  });

  var lastAppRequestCount, lastDatabaseRequestCount;

  // Unfortunately, what routes are entered when is very messy when
  // the first url is loaded in a test app. So let's ignore the initial
  // values and just confirm the requests are made on subsequent navigation.
  signIn();
  visit('/stacks/my-stack-1/apps');

  andThen(function() {
    lastAppRequestCount = appRequestCount;
    lastDatabaseRequestCount = databaseRequestCount;
  });

  visit('/stacks/my-stack-1/databases');

  andThen(function() {
    equal(databaseRequestCount, lastDatabaseRequestCount + 1, 'did one more database request');
    equal(appRequestCount, lastAppRequestCount, 'no new app request');
  });

  visit('/stacks/my-stack-1/apps');

  andThen(function() {
    equal(databaseRequestCount, lastDatabaseRequestCount + 1, 'still one database request');
    equal(appRequestCount, lastAppRequestCount + 1, 'one new app request');
  });
});
