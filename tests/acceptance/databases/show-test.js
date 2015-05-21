import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;

module('Acceptance: Databases Show', {
  setup: function() {
    App = startApp();
    stubOrganizations();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /databases/:id requires authentication', function(){
  expectRequiresAuthentication('/databases/1');
});

test('visiting /databases/my-db-id shows the database', function() {
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
    equal(currentPath(), 'dashboard.database.activity', 'show page is visited');
    var contentNode = findWithAssert('*:contains(my-database)');
    ok(contentNode.length > 0, 'my-database is on the page');
  });
});
