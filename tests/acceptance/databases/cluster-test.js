import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;
var stackHandle = 'rrriggi';

module('Acceptance: Database: Replicate: Clustering', {
  beforeEach: function() {
    App = startApp();
    stubOrganization();
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

    stubDatabase({
      id: 1,
      handle: 'mongo-test',
      type: 'mongodb',
      _links: {
        stack: { href: `/accounts/${stackHandle}` }
      }
    });

    stubDatabase({
      id: 2,
      handle: 'redis-test',
      type: 'redis',
      _links: {
        stack: { href: `/accounts/${stackHandle}` }
      }
    });

    var mongo1 = {
      id: 10,
      handle: 'mongo-1',
      type: 'mongodb',
      _links: {
        self: { href: '/databases/10' },
        stack: { href: `/accounts/${stackHandle}` },
        dependents: { href: '/databases/10/dependents' }
      }
    };

    var mongo2 = {
      id: 11,
      handle: 'mongo-2',
      type: 'mongodb',
      _embedded: {
        initialize_from: mongo1
      },
      _links: {
        self: { href: '/databases/11' },
        stack: { href: `/accounts/${stackHandle}` }
      }
    };

    stubDatabase(mongo2);
    stubDatabase(mongo1);
    stubRequest('get', '/databases/10/dependents', function(){
      return this.success({
        _embedded: {
          dependents: [mongo2]
        }
      });
    });

  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('/databases/:id/cluster requires authentication', function() {
  expectRequiresAuthentication('/databases/1/cluster');
});

test('/databases/:id/cluster links to support without dependents', function() {
  signInAndVisit('/databases/1/cluster');
  andThen(function(){
    var panel = findWithAssert('.panel-body');
    findWithAssert('a:contains(contact support)', panel);
    expectTitle(`Cluster mongo-test - ${stackHandle}`);
  });
});

test('/databases/:id/cluster links to dependents', function(assert) {
  signInAndVisit('/databases/10/cluster');
  andThen(function(){
    // There are two panels here, so we have a to be a bit less
    // specific.
    var page = findWithAssert('.layout-container');

    expectLink('/databases/11', {context: page});
    findWithAssert('a:contains(mongo-2)', page);

    var links = find('.panel li a', page);
    assert.ok(links.length === 1);
  });
});

test('/databases/:id/cluster does not allow clustering from a dependent', function(assert) {
  signInAndVisit('/databases/11/cluster');
  andThen(function(){
    // There are two panels here, so we have a to be a bit less
    // specific.
    var page = findWithAssert('.layout-container');

    var supportLinks = find('a:contains(contact support)', page);
    assert.ok(supportLinks.length === 0);

    expectLink('/databases/10', {context: page});
    findWithAssert('a:contains(mongo-1)', page);
  });
});

test('/databases/:id links to cluster for MongoDB', function() {
  signInAndVisit('/databases/1');
  andThen(function(){
    expectLink('/databases/1/cluster');
  });
});

test('/databases/:id does not link to cluster for Redis', function() {
  signInAndVisit('/databases/2');
  andThen(function(){
    expectNoLink('/databases/2/cluster');
  });
});

test('/databases/:id links to parent', function() {
  signInAndVisit('/databases/11');
  andThen(function(){
    var header = findWithAssert('.resource-header .resource-title');
    findWithAssert('span:contains(clustered with)', header);
    findWithAssert('a:contains(mongo-1)', header);
    expectLink('/databases/10', {context: header});
  });
});

test('/databases/:id/deprovision requires dependents to be deleted', function (assert) {
  signInAndVisit('/databases/10/deprovision');

  andThen(function(){
    var panel = findWithAssert('.panel-body');

    expectNoButton('Deprovision Permanently', {context: panel});
    expectLink('/databases/11', {context: panel});
    findWithAssert('a:contains(mongo-2)', panel);

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
