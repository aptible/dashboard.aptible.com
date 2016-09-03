import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

let App;
let stackId = 'stack-id';
let stackHandle = 'the-stack-dev';
let url = `/stacks/${stackId}`;

module('Acceptance: Stack Show', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test(`visit ${url} shows basic stack info`, function(assert) {
  let appsURL = `/accounts/${stackId}/apps`;
  let databasesURL = `/accounts/${stackId}/databases`;

  let stackData = {
    id: stackId,
    handle: stackHandle,
    total_app_count: 2,
    total_database_count: 2,
    total_disk_size: 6,
    app_container_count: 5,
    _links: {
      apps: { href: appsURL },
      databases: { href: databasesURL }
    }
  };
  stubStack(stackData);
  stubStacks([stackData]);
  stubOrganization();

  let appData = [{
    id: 'app-1',
    _embedded: {
      services: [{
        id: 'service-1',
        container_count: 2,
      }]
    }
  }, {
    id: 'app-2',
    _embedded: {
      services: [{
        id: 'service-2',
        container_count: 3
      }]
    }
  }];


  stubRequest('get', appsURL, function(){
    return this.success({
      _embedded: {
        apps: appData
      }
    });
  });

  signInAndVisit(url);

  andThen(function() {
    assert.equal(currentPath(), 'requires-authorization.enclave.stack.apps.index');
    assert.ok(find('ul.resource-navigation li.active a:contains(Apps)').length,
              'Has active apps link');

    expectLink(`stacks/${stackId}/databases`);
    expectLink(`stacks/${stackId}/logging`);
    expectLink(`stacks/${stackId}/apps`);

    assert.ok(find('h5:contains(Shared Environment)').length,
       'has shared stack header');

    assert.ok(find(`h1:contains(${stackHandle})`).length,
       `has stack handle: ${stackHandle}`);

    assert.ok(find(`h5:contains(${appData.length} Apps)`).length,
       'Header that contains app length');

    assert.ok(find(`h5:contains(2 Databases)`).length,
       'Header that contains db length');

    assert.ok(find('h5:contains(0 Log Drains)').length,
        'Header contains log drain length');

    // 2 + 3
    assert.ok(find(`h3:contains(Using 5 containers)`).length,
       'has containers count');

    // 4 + 2
    assert.ok(find(`h3:contains(Using 6GB of disk)`).length,
       'has disk size header');

    assert.ok(find(`h3:contains(None configured)`).length,
        'has log drain header');
  });
});
