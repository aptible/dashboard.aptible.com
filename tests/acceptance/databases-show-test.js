import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App;

module('Acceptance: Databases Show', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /databases/my-db-id shows the database', function() {
  stubRequest('get', '/databases/my-db-id', function(request){
    return this.success({
      id: 'my-db-id',
      handle: 'my-database'
    });
  });

  signInAndVisit('/databases/my-db-id');
  andThen(function() {
    equal(currentPath(), 'databases.show.index', 'show page is visited');
    var contentNode = findWithAssert('*:contains(my-database)');
    ok(contentNode.length > 0, 'my-database is on the page');
  });
});
