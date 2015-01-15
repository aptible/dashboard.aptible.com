import { stubRequest } from '../helpers/fake-server';
import {
  paginatedResourceQueryParamsPage2Test,
  paginatedResourceUpdatesQueryParamsTest,
  resourceOperationsTest,
  paginatedResourceTest
} from '../helpers/shared-tests';

import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;

var sharedTestOptions = {
  resourceType: 'apps'
};

module('Acceptance: Apps Paginated Operations', {
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

test('visit /apps/:id/activity shows operations', function(){
  resourceOperationsTest(sharedTestOptions);
});

test('visit /apps/:id/activity does pagination', function(){
  paginatedResourceTest(sharedTestOptions);
});

test('visit /apps/:id/activity updates query params when changing page', function(){
  paginatedResourceUpdatesQueryParamsTest(sharedTestOptions);
});

test('visit /apps/:id/activity?page=2 starts at 2nd page', function(){
  paginatedResourceQueryParamsPage2Test(sharedTestOptions);
});
