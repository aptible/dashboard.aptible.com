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
    _links: {
      apps: { href: appsURL },
      databases: { href: databasesURL }
    }
  };
  stubStack(stackData);
  stubStacks([stackData]);
  stubOrganizations();
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

  let databaseData = [{
    id: 'db-1',
    _embedded: {
      disk: {
        id: 'disk-1',
        size: 4
      }
    }
  }, {
    id: 'db-2',
    _embedded: {
      disk: {
        id: 'disk-2',
        size: 2
      }
    }
  }];

  stubRequest('get', appsURL, function(){
    return this.success({
      _embedded: {
        apps: appData
      }
    });
  });

  stubRequest('get', databasesURL, function(){
    return this.success({
      _embedded: {
        databases: databaseData
      }
    });
  });

  signInAndVisit(url);

  andThen(function() {
    assert.equal(currentPath(), 'dashboard.stack.apps.index');

    expectLink(`stacks/${stackId}/databases`);
    expectLink(`stacks/${stackId}/logging`);
    expectLink(`stacks/${stackId}/apps`);

    assert.ok(find('h5:contains(Shared Environment)').length,
       'has shared stack header');

    assert.ok(find(`h1:contains(${stackHandle})`).length,
       `has stack handle: ${stackHandle}`);

    assert.ok(find(`h5:contains(${appData.length} Apps)`).length,
       'Header that contains app length');

    assert.ok(find(`h5:contains(${databaseData.length} Databases)`).length,
       'Header that contains db length');

    // 2 + 3
    assert.ok(find(`h3:contains(Running on 5 containers)`).length,
       'has containers count');

    // 4 + 2
    assert.ok(find(`h3:contains(Using 6GB of Disk)`).length,
       'has disk size header');
  });
});
