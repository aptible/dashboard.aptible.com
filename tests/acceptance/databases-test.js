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
    equal(row.length, 4, 'shows 4 databases');
  });
});

test('visiting /databases shows list of stacks', function() {
  signInAndVisit('/databases');

  andThen(function() {
    var panels = findWithAssert('.panel.account-panel');
    equal(panels.length, 2, 'shows 2 stacks');
  });
});

test('visiting /databases then clicking on an database visits the database', function() {
  signInAndVisit('/databases');
  click('.database-link');
  andThen(function(){
    equal(currentPath(), 'databases.show.index', 'show page is visited');
  });
});


test('visiting /databases shows link to db history for each db', function() {
  // from stubStacks:
  var dbIds = ['1','2','3','4'];

  signInAndVisit('/databases');

  andThen(function(){
    dbIds.forEach(function(dbId){
      var href = '/databases/' + dbId + '/operations';
      var linkEl = find('a[href~="' + href + '"]');

      ok(linkEl.length, 'has link to ' + href);
    });
  });
});
