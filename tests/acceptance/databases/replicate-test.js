import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;
var stackHandle = 'rrriggi';

module('Acceptance: Database Replication', {
  beforeEach: function() {
    App = startApp();
    stubOrganizations();
    stubStacks();

    stubStack({
      id: stackHandle,
      handle: stackHandle
    });

    stubRequest('get', '/databases/:id/operations', function(){
      return this.success({
        _embedded: {
          operations: []
        }
      });
    });

    [[1, 'redis'], [2, 'mysql'], [3, 'postgresql'], [4, 'elasticsearch']].forEach((testDb) => {
      stubDatabase({
        id: testDb[0],
        handle: `${testDb[1]}-test`,
        type: testDb[1],
        _links: {
          stack: { href: `/accounts/${stackHandle}` }
        }
      });
    });

    var master = {
      id: 10,
      handle: 'redis-master',
      type: 'redis',
      _links: {
        self: { href: '/databases/10' },
        stack: { href: `/accounts/${stackHandle}` },
        dependents: { href: '/databases/10/dependents' }
      }
    };

    var replica = {
      id: 11,
      handle: 'redis-replica',
      type: 'redis',
      _embedded: {
        initialize_from: master
      },
      _links: {
        self: { href: '/databases/11' },
        stack: { href: `/accounts/${stackHandle}` }
      }
    };

    stubDatabase(replica);
    stubDatabase(master);
    stubRequest('get', '/databases/10/dependents', function(){
      return this.success({
        _embedded: {
          dependents: [replica]
        }
      });
    });

  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('/databases/:id/replicate requires authentication', function() {
  expectRequiresAuthentication('/databases/1/replicate');
});

test('/databases/:id/replicate links to support', function() {
  signInAndVisit('/databases/1/replicate');
  andThen(function(){
    var panel = findWithAssert('.panel-body');
    findWithAssert('a:contains(contact support)', panel);
    expectTitle(`Replicate redis-test - ${stackHandle}`);
  });
});

test('/databases/:id/replicate links to dependents', function(assert) {
  signInAndVisit('/databases/10/replicate');
  andThen(function(){
    // There are two panels here, so we have a to be a bit less
    // specific.
    var page = findWithAssert('.layout-container');

    expectLink('/databases/11', {context: page});
    findWithAssert('a:contains(redis-replica)', page);

    var links = find('.panel li a', page);
    assert.ok(links.length === 1);
  });
});

test('/databases/:id links to replicate for Redis', function() {
  signInAndVisit('/databases/1');
  andThen(function(){
    expectLink('/databases/1/replicate');
  });
});

test('/databases/:id does not link to replicate for ElasticSearch', function() {
  signInAndVisit('/databases/4');
  andThen(function(){
    expectNoLink('/databases/4/replicate');
  });
});

test('/databases/:id links to parent', function() {
  signInAndVisit('/databases/11');
  andThen(function(){
    var header = findWithAssert('.resource-header .resource-title');
    findWithAssert('span:contains(replicates)', header);
    findWithAssert('a:contains(redis-master)', header);
    expectLink('/databases/10', {context: header});
  });
});

test('/databases/:id/deprovision requires dependents to be deleted', function (assert) {
  signInAndVisit('/databases/10/deprovision');

  andThen(function(){
    var panel = findWithAssert('.panel-body');

    expectNoButton('Deprovision Permanently', {context: panel});
    expectLink('/databases/11', {context: panel});
    findWithAssert('a:contains(redis-replica)', panel);

    var links = find('li a', panel);
    assert.ok(links.length === 1);
  });
});

test('/databases/:id/deprovision allows dependents to be deleted', function () {
  signInAndVisit('/databases/11/deprovision');
  andThen(function(){
    var panel = findWithAssert('.panel-body');
    expectButton('Deprovision Permanently', {context: panel});
  });
});

