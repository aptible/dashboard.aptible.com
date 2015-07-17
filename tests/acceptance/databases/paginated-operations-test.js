import { stubRequest } from '../../helpers/fake-server';
import {module, test} from 'qunit';
import {
  paginatedResourceQueryParamsPage2Test,
  paginatedResourceUpdatesQueryParamsTest,
  resourceOperationsTest,
  paginatedResourceTest
} from '../../helpers/shared-tests';

import Ember from 'ember';
import startApp from '../../helpers/start-app';

var App;

var sharedTestOptions = {
  resourceType: 'databases'
};

module('Acceptance: Databases Paginated Operations', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit /apps/:id/activity requires authentication', function(assert) {
  expectRequiresAuthentication('/databases/1/activity');
});

test('visit /databases/:id/activity shows operations', function(assert) {
  resourceOperationsTest(sharedTestOptions);
});

test('visit /databases/:id/activity does pagination', function(assert) {
  paginatedResourceTest(sharedTestOptions);
});

test('visit /databases/:id/activity updates query params when changing page', function(assert) {
  paginatedResourceUpdatesQueryParamsTest(sharedTestOptions);
});

test('visit /databases/:id/activity?page=2 starts at 2nd page', function(assert) {
  paginatedResourceQueryParamsPage2Test(sharedTestOptions);
});
