import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';
import {
  paginatedResourceTest,
  resourceOperationsTest,
  paginatedResourceUpdatesQueryParamsTest,
  paginatedResourceQueryParamsPage2Test
} from '../helpers/shared-tests';

var App;
var sharedTestOptions = {
  resourceType: 'databases'
};


module('Acceptance: Databases Operations', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit /databases/:id/operations requires authentication', function(){
  expectRequiresAuthentication('/databases/1/operations');
});

test('visit /apps/:id/operations shows operations', function(){
  var options = sharedTestOptions;
  options.expectedHeader = 'Database Audit History';

  resourceOperationsTest(options);
});

test('visit /apps/:id/operations does pagination', function(){
  paginatedResourceTest(sharedTestOptions);
});

test('visit /databases/:id/operations updates query params when changing page', function(){
  paginatedResourceUpdatesQueryParamsTest(sharedTestOptions);
});

test('visit /databases/:id/operations?page=2 starts at 2nd page', function(){
  paginatedResourceQueryParamsPage2Test(sharedTestOptions);
});
