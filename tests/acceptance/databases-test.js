import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;

module('Acceptance: Databases', {
  setup: function() {
    App = startApp();
    stubStacks({includeDatabases:true});
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /stacks/:stack_id/databases requires authentication', function(){
  expectRequiresAuthentication('/stacks/1/databases');
});

test('visiting /stacks/:stack_id/databases', function() {
  signInAndVisit('/stacks/1/databases');

  andThen(function() {
    equal(currentPath(), 'stacks.stack.databases.index');
  });
});

test('visiting /stacks/1/databases shows list of databases', function() {
  signInAndVisit('/stacks/1/databases');

  andThen(function() {
    var row = findWithAssert('.panel.database');
    equal(row.length, 2, 'shows 2 databases');
  });
});

test('visiting /stacks/1/databases then clicking on an database visits the database', function() {
  signInAndVisit('/stacks/1/databases');

  andThen(function(){
    var dbLink = find('a[href~="/databases/1"]');
    ok(dbLink.length, 'has link to database');

    click(dbLink);
  });

  andThen(function(){
    equal(currentPath(), 'database.index', 'show page is visited');
  });
});
