import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App;

module('Acceptance: /stacks/:stack_id/databases/new', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit /stacks/1/databases/new', function(){
  expect(2);

  stubApps();

  stubRequest('get', '/accounts/1', function(request){
    var json = JSON.parse(request.requestBody);

    return this.success({
      id: '1'
    });
  });

  signInAndVisit('/stacks/1/databases/new');

  andThen(function(){
    equal(currentPath(), 'stack.new-database');

    var input = findWithAssert('input.database-handle');
    ok(input.length, 'has database handle input');
  });
});
