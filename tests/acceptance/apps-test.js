import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;

module('Acceptance: Apps', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /apps', function() {
  signInAndVisit('/apps');

  andThen(function() {
    equal(currentPath(), 'apps.index');
  });
});

test('visiting /apps shows list of apps', function() {
  signInAndVisit('/apps');

  andThen(function() {
    var appListingSelector = '.app-row';
    equal(find(appListingSelector).length, 2, 'shows 2 apps');
  });
});
