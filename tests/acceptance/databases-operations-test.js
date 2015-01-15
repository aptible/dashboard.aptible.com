import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App;

module('Acceptance: Databases Operations', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit /databases/:id/activity requires authentication', function(){
  expectRequiresAuthentication('/databases/1/activity');
});

test('visit /databases/:id/activity shows operations', function(){
  var dbId = 'my-db-id',
      dbUrl = '/databases/' + dbId,
      dbOpsUrl = dbUrl + '/activity',
      dbOpsApiUrl = dbUrl + '/operations';

  stubRequest('get', dbUrl, function(request){
    return this.success({
      id: dbId,
      handle: 'my-db-handle',
      _links: {
        operations: { href: dbOpsApiUrl }
      }
    });
  });

  stubRequest('get', dbOpsApiUrl, function(request){
    return this.success({
      _embedded: {
        operations: [{
          id: 1,
          type: 'configure',
          status: 'succeeded',
          createdAt: '2014-11-19T00:15:33.836Z',
          userName: 'Frank Macreery',
          userEmail: 'frank@aptible.com'
        }, {
          id: 2,
          type: 'deploy',
          status: 'succeeded',
          createdAt: '2014-11-19T00:15:33.836Z',
          userName: 'Frank Macreery',
          userEmail: 'frank@aptible.com'
        }, {
          id: 3,
          type: 'execute',
          status: 'failed',
          createdAt: '2014-11-19T00:15:33.836Z',
          userName: 'Frank Macreery',
          userEmail: 'frank@aptible.com'
        }]
      }
    });
  });


  signInAndVisit(dbOpsUrl);

  andThen(function(){
    var operationsContainer = find('.operations');
    var operations = find('.operation', operationsContainer);

    equal(operations.length, 3, 'has 3 operations');

    ['Configure', 'Deploy', 'Execute'].forEach(function(type){
      ok(find('.operation-type:contains(' + type + ')').length,
         'has capitalized operation type: ' + type);
    });

    ['Succeeded', 'Failed'].forEach(function(type){
      ok(find('.operation-status:contains(' + type + ')').length,
         'has capitalized operation status: ' + type);
    });

    var operationCreatedBy = find('.operation-created-by:contains(Frank Macreery)');
    ok(operationCreatedBy.length, 'has operation created by username');
  });
});
