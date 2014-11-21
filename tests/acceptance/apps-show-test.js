import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App;

module('Acceptance: Apps Show', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /apps/my-app-id shows the app', function() {
  stubRequest('get', '/apps/my-app-id', function(request){
    ok(true, 'loads app');
    return this.success({
      id: '4',
      handle: 'my-app'
    });
  });

  signInAndVisit('/apps/my-app-id');
  andThen(function() {
    equal(currentPath(), 'apps.show', 'show page is visited');
    var contentNode = findWithAssert('*:contains(my-app)');
    ok(contentNode.length > 0, 'my-app is on the page');
  });
});
