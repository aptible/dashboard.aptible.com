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
  stubRequest('get', '/accounts/my-stack-1/apps', function() {
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

  signInAndVisit(url);
  andThen(function(){
    assert.equal(currentPath(), 'requires-authorization.enclave.stack.apps.new');
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
  signInAndVisit(url);

  andThen(function() {
    assert.equal(currentPath(), 'requires-authorization.enclave.stack.apps.index');
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

  signInAndVisit(url);
  andThen(function() {
    assert.equal(find('.panel.app').length, 2, '2 apps');
  });
});

test(`visiting ${url} shows all pages of apps`, function(assert) {
  assert.expect(7);

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
        container_count: 3,
        container_memory_limit_mb: 2048
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
        container_count: 0
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

  signInAndVisit(url);
  andThen(function() {
    let apps = find('.panel.app');
    let app1 = apps.eq(0);
    let app2 = apps.eq(1);

    assert.equal(apps.length, 2, '2 apps');
    assert.equal(app1.find('.in-service').length, 1, 'app is in service');
    assert.equal(Ember.$.trim(app1.find('.service-container-count').text()), '2GB', 'shows correct container size');
    assert.equal(app1.find('.count').text(), '3', 'shows correct count');

    assert.equal(app2.find('.in-service').length, 0, 'app 2 not in service');
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

  signInAndVisit(url);
  andThen(function() {
    let el = find('.deprovisioning-apps');
    assert.equal(el.find('.panel.app').length, 1, '1 deprovisioning apps');
  });
});

test(`visiting ${url} then clicking on an app visits the app`, function(assert) {
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
    assert.equal(currentPath(), 'requires-authorization.enclave.app.services.index', 'app show page is visited');
  });
});

test(`visit ${url} shows create app button if user is verified`, function() {
  let stack = {
    id: stackId,
    _links: {
      apps: { href: `/accounts/${stackId}/apps` },
      organization: { href: '/organizations/1' }
    }
  };
  stubOrganization();
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
