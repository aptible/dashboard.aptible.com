import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from "../../helpers/fake-server";

let App;
let stackId = 'stack-id';
let stackHandle = 'the-stack-dev';
let url = `/stacks/${stackId}`;

module('Acceptance: Stack Show', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test(`visit ${url} shows basic stack info`, function() {
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

  stubRequest('get', appsURL, function(request){
    return this.success({
      _embedded: {
        apps: appData
      }
    });
  });

  stubRequest('get', databasesURL, function(request){
    return this.success({
      _embedded: {
        databases: databaseData
      }
    });
  });

  signInAndVisit(url);

  andThen(function() {
    equal(currentPath(), 'stack.apps.index');

    expectLink(`stacks/${stackId}/databases`);
    expectLink(`stacks/${stackId}/logging`);
    expectLink(`stacks/${stackId}/apps`);

    ok(find('h5:contains(Shared Stack)').length,
       'has shared stack header');

    ok(find(`h1:contains(${stackHandle})`).length,
       `has stack handle: ${stackHandle}`);

    ok(find(`h5:contains(${appData.length} Apps)`).length,
       'Header that contains app length');

    ok(find(`h5:contains(${databaseData.length} Databases)`).length,
       'Header that contains db length');

    // 2 + 3
    ok(find(`h3:contains(Running on 5 containers)`).length,
       'has containers count');

    // 4 + 2
    ok(find(`h3:contains(Using 6GB of Disk)`).length,
       'has disk size header');
  });
});

