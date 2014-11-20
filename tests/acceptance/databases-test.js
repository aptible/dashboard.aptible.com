import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;

module('Acceptance: Databases', {
  setup: function() {
    App = startApp();
    stubDatabases();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /databases', function() {
  signInAndVisit('/databases');

  andThen(function() {
    equal(currentPath(), 'databases.index');
  });
});

test('visiting /databases when not signed in', function() {
  visit('/databases');

  andThen(function() {
    equal(currentPath(), 'login');
  });
});


test('visiting /databases shows list of databases', function() {
  signInAndVisit('/databases');

  andThen(function() {
    var row = findWithAssert('.database-row');
    equal(row.length, 2, 'shows 2 databases');
  });
});

test('visiting /databases then clicking on an database visits the database', function() {
  signInAndVisit('/databases');
  click('.database-link');
  andThen(function(){
    equal(currentPath(), 'databases.show', 'show page is visited');
  });
});

test('visiting /databases/my-database shows the database', function() {
  signInAndVisit('/databases/my-database');
  andThen(function() {
    equal(currentPath(), 'databases.show', 'show page is visited');
    var contentNode = findWithAssert('*:contains(my-database)');
    ok(contentNode.length > 0, 'my-app is on the page');
  });
});
