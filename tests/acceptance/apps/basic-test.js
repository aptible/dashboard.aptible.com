import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App;
let stackId = 'my-stack-1';
let url = `/stacks/${stackId}/apps`;

module('Acceptance: Apps', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test(`visiting ${url} requires authentication`, function() {
  expectRequiresAuthentication(url);
});

test(`visiting ${url} with no apps redirects to apps new`, function(assert) {
  stubRequest('get', '/accounts/my-stack-1/apps', function(){
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
    assert.equal(currentPath(), 'dashboard.stack.apps.new');
  });
});

test(`visiting ${url}`, function(assert) {
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
    assert.equal(currentPath(), 'dashboard.stack.apps.index');
    expectTitle(`${stackHandle} Apps`);
  });
});

test(`visiting ${url} shows list of apps`, function(assert) {
  let orgId = 1;
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
    assert.equal(find('.panel.app').length, 2, '2 apps');
  });
});

test(`visiting ${url} shows all pages of apps`, function(assert) {
  assert.expect(3);

  let orgId = 1;
  let stackHandle = 'my-stack-1';

  let apps = [{
    id: 1,
    handle: 'my-app-1-stack-1',
    status: 'provisioned',
    _embedded: {
      services: [{
        id: '1',
        handle: 'the-service',
        container_count: 1
      }]
    },
    _links: {
      account: { href: '/accounts/my-stack-1'}
    }
  }, {
    id: 2,
    handle: 'my-app-2-stack-1',
    status: 'provisioned',
    _embedded: {
      services: [{
        id: '2',
        handle: 'the-service-2',
        container_count: 1
      }]
    },
    _links: {
      account: { href: '/accounts/my-stack-1'}
    }
  }];

  stubStacks();

  stubRequest('get', '/accounts/my-stack-1/apps', function(request){
    let page = request.queryParams.page || 1;

    assert.ok(true, `app request was made for page #${page}`);

    return this.success({
      _links: {},
      _embedded: {
        apps: [ apps[page - 1]]
      },
      current_page: page,
      per_page: 1,
      total_count: 2
    });
  });

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
    assert.equal(find('.panel.app').length, 2, '2 apps');
  });
});

test(`visiting ${url} shows list of provisioning apps`, function(assert) {
  let orgId = 1;
  let stackHandle = 'my-stack-1';

  stubRequest('get', '/accounts/my-stack-1/apps', function(){
    return this.success({
      _links: {},
      _embedded: {
        apps: [{
          id: 1,
          handle: 'my-app-1-stack-1',
          status: 'pending',
          _embedded: {
            services: [{
              id: '1',
              handle: 'the-service',
              container_count: 1
            }]
          },
          _links: {
            account: { href: '/accounts/my-stack-1'}
          }
        }]
      }
    });
  });

  stubStacks({ includeApps: false });
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
    let el = find('.pending-apps');
    assert.equal(el.find('.panel.app').length, 1, '1 pending app');
  });
});

test(`visiting ${url} shows list of deprovisioning apps`, function(assert) {
  let orgId = 1;
  let stackHandle = 'my-stack-1';

  stubRequest('get', '/accounts/my-stack-1/apps', function(){
    return this.success({
      _links: {},
      _embedded: {
        apps: [{
          id: 1,
          handle: 'my-app-1-stack-1',
          status: 'deprovisioning',
          _embedded: {
            services: [{
              id: '1',
              handle: 'the-service',
              container_count: 1
            }]
          },
          _links: {
            account: { href: '/accounts/my-stack-1'}
          }
        }]
      }
    });
  });

  stubStacks({ includeApps: false });
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
    let el = find('.deprovisioning-apps');
    assert.equal(el.find('.panel.app').length, 1, '1 deprovisioning apps');
  });
});

test(`visiting ${url} then clicking on an app visits the app`, function(assert) {
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
    assert.equal(currentPath(), 'dashboard.app.services.index', 'app show page is visited');
  });
});

test(`visit ${url} shows create app button if user is verified`, function() {
  let stack = {
    id: stackId,
    _links: {
      apps: { href: `/accounts/${stackId}/apps` },
      permissions: { href: `/accounts/${stackId}/permissions` }
    }
  };
  stubOrganization();
  stubOrganizations();
  stubStacks({ includeApps: true }, [stack]);
  stubStack(stack);

  let userData = {id: 'user1', verified: true};
  signInAndVisit(url, userData);
  andThen( () => {
    expectButton('Create App');
  });
});

test(`visit ${url} does not show create app button if user is not verified`, function() {
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
