import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;

module('Acceptance: Databases Show', {
  setup: function() {
    App = startApp();
    stubDatabases();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /databases/my-database shows the database', function() {
  signInAndVisit('/databases/my-database');
  andThen(function() {
    equal(currentPath(), 'databases.show', 'show page is visited');
    var contentNode = findWithAssert('*:contains(my-database)');
    ok(contentNode.length > 0, 'my-database is on the page');
  });
});
