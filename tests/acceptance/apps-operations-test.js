import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App;

module('Acceptance: Apps Operations', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit /apps/:id/activity requires authentication', function(){
  expectRequiresAuthentication('/apps/1/activity');
});

test('visit /apps/:id/activity show operations', function(){
  var appId = 'my-app-id';

  stubRequest('get', '/apps/' + appId, function(request){
    return this.success({
      id: appId,
      handle: 'my-app-handle',
      _links: {
        operations: { href: '/apps/' + appId + '/operations' }
      }
    });
  });

  stubRequest('get', '/apps/' + appId + '/operations', function(request){
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

  signInAndVisit('/apps/' + appId + '/activity');

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
