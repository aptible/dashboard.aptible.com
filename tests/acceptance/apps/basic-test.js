import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App;
let stackId = 'my-stack-1';
let url = `/stacks/${stackId}/apps`;

module('Acceptance: Apps', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});


test(`visiting ${url} requires authentication`, function() {
  expectRequiresAuthentication(url);
});

test(`visiting ${url} with no apps redirects to apps new`, function() {
  stubRequest('get', '/accounts/my-stack-1/apps', function(request){
    return this.success({
      _links: {},
      _embedded: {
        apps: []
      }
    });
  });
  stubStacks({ includeApps: false });
  stubStack({ id: stackId });
  stubOrganization();
  stubOrganizations();

  signInAndVisit(url);
  andThen(function(){
    equal(currentPath(), 'stack.apps.new');
  });
});

test(`visiting ${url}`, function() {
  let orgId = 1, orgName = 'Sprocket Co';
  let stackHandle = 'my-stack-1';

  // This is needed to stub /stack/my-stack-1/apps
  stubStacks({ includeApps: true });
  stubStack({
    id: stackId,
    handle: stackHandle,
    _links: {
      apps: { href: `/accounts/${stackId}/apps` },
      organization: { href: `/organizations/${orgId}` }
    }
  });
  stubOrganization({
    id: orgId,
    name: orgName
  });
  stubOrganizations();
  signInAndVisit(url);

  andThen(function() {
    equal(currentPath(), 'stack.apps.index');
    expectTitle(`${stackHandle} Apps - ${orgName}`);
  });
});

test(`visiting ${url} shows list of apps`, function() {
  let orgId = 1, orgName = 'Sprocket Co';
  let stackHandle = 'my-stack-1';

  // Just needed to stub /stack/my-stack-1/apps
  stubStacks({ includeApps: true });
  stubStack({
    id: stackId,
    handle: stackHandle,
    _links: {
      apps: { href: `/accounts/${stackId}/apps` },
      organization: { href: `/organizations/${orgId}` }
    }
  });
  stubOrganization();
  stubOrganizations();

  signInAndVisit(url);
  andThen(function() {
    equal(find('.panel.app').length, 2, '2 apps');
  });
});

test(`visiting ${url} then clicking on an app visits the app`, function() {
  stubOrganizations();
  stubOrganization();
  stubStacks({ includeApps: true });
  stubStack({
    id: stackId,
    _links: {
      apps: { href: `/accounts/${stackId}/apps` }
    }
  });

  signInAndVisit(url);

  andThen(function(){
    let appLink = expectLink("/apps/1");
    click(appLink);
  });

  andThen(function(){
    equal(currentPath(), 'app.services', 'app show page is visited');
  });
});

test(`${url} requests apps, databases on each visit`, function() {
  var appRequestCount = 0;
  var databaseRequestCount = 0;
  stubOrganization();
  stubOrganizations();
  stubStacks();
  stubStack({
    id: stackId,
    _links: {
      databases: {href: `/accounts/${stackId}/databases`},
      apps: {href: `/accounts/${stackId}/apps`}
    }
  });

  stubRequest('get', `/accounts/${stackId}/databases`, function(request){
    databaseRequestCount++;
    return this.success({
      _embedded: { databases: [] }
    });
  });

  stubRequest('get', `/accounts/${stackId}/apps`, function(request){
    appRequestCount++;
    return this.success({
      _embedded: { apps: [] }
    });
  });

  var lastAppRequestCount, lastDatabaseRequestCount;

  // Unfortunately, what routes are entered when is very messy when
  // the first url is loaded in a test app. So let's ignore the initial
  // values and just confirm the requests are made on subsequent navigation.
  signInAndVisit(url);

  andThen(function() {
    lastAppRequestCount = appRequestCount;
    lastDatabaseRequestCount = databaseRequestCount;
  });

  visit(`/stacks/${stackId}/databases`);

  andThen(function() {
    equal(databaseRequestCount, lastDatabaseRequestCount + 1, 'did one more database request');
    equal(appRequestCount, lastAppRequestCount, 'no new app request');
  });

  visit(`/stacks/${stackId}/apps`);

  andThen(function() {
    equal(databaseRequestCount, lastDatabaseRequestCount + 1, 'still one database request');
    equal(appRequestCount, lastAppRequestCount + 1, 'one new app request');
  });
});

test(`visit ${url} shows create app button if user is verified`, function(){
  stubOrganization();
  stubOrganizations();
  stubStacks({ includeApps: true });
  stubStack({
    id: stackId,
    _links: {
      apps: { href: `/accounts/${stackId}/apps` }
    }
  });

  let userData = {id: 'user1', verified: true};
  signInAndVisit(url, userData);
  andThen( () => {
    expectButton('Create App');
  });
});

test(`visit ${url} does not show create app button if user is not verified`, function(){
  stubOrganization();
  stubOrganizations();
  stubStacks({ includeApps: true });
  stubStack({
    id: stackId,
    _links: {
      apps: { href: `/accounts/${stackId}/apps` }
    }
  });

  let userData = {id: 'user1', verified: false};
  signInAndVisit(url, userData);
  andThen( () => {
    expectNoButton('Create App');
  });
});
