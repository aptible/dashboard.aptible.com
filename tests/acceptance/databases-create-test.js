import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App;

module('Acceptance: Database New', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit /stacks/1/databases/new', function(){
  var stackId = '1';
  stubStack({id:stackId});

  signInAndVisit('/stacks/' + stackId + '/databases/new');

  andThen(function(){
    equal(currentPath(), 'stack.new-database');

    var input = findWithAssert('input.database-handle');
    ok(input.length, 'has database handle input');

    var button = findWithAssert(':contains(Create database)');
    ok(button.length, 'has create button');
  });
});

test('visit /stacks/1/databases/new and create', function(){
  expect(3);

  stubStack({id: 1, handle:'stack-1'});

  stubRequest('get', '/accounts', function(request){
    return this.success({
      _embedded: {
        accounts: [{
          id: '1',
          handle: 'stack-1',
          _links: {
            databases: { href: '/accounts/1/databases' }
          }
        }]
      }
    });
  });

  stubRequest('get', '/accounts/1/databases', function(request){
    return this.success({
      _embedded: {
        databases: [{
          id: 'my-new-db-id',
          handle: 'my-new-db'
        }]
      }
    });
  });

  stubRequest('post', '/accounts/1/databases', function(request){
    var json = JSON.parse(request.requestBody);
    equal(json.handle, 'my-new-db', 'posts db handle');

    return this.success(201, {
      id: 'my-new-db-id',
      handle: 'my-new-db'
    });
  });


  signInAndVisit('/stacks/1/databases/new');
  fillIn('input.database-handle', 'my-new-db');
  click(':contains(Create database)');

  andThen(function(){
    equal(currentPath(), 'databases.index');

    var dbHandle = findWithAssert(':contains(my-new-db)');
    ok(dbHandle.length, 'has new db handle');
  });
});
