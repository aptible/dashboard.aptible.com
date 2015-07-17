import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;

module('Acceptance: Databases Show', {
  beforeEach: function() {
    App = startApp();
    stubOrganizations();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /databases/:id requires authentication', function(assert) {
  expectRequiresAuthentication('/databases/1');
});

test('visiting /databases/my-db-id shows the database', function(assert) {
  stubStack({ id: 'my-stack-1' });
  stubRequest('get', '/databases/my-db-id', function(request){
    return this.success({
      id: 'my-db-id',
      handle: 'my-database',
      _links: {
        account: { href: '/accounts/my-stack-1' }
      }
    });
  });

  stubRequest('get', '/databases/my-db-id/operations', function(request){
    return this.success({
      _embedded: {
        operations: []
      }
    });
  });

  signInAndVisit('/databases/my-db-id');
  andThen(function() {
    assert.equal(currentPath(), 'dashboard.database.activity', 'show page is visited');
    var contentNode = findWithAssert('*:contains(my-database)');
    assert.ok(contentNode.length > 0, 'my-database is on the page');
  });
});
