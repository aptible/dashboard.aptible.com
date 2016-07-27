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

function doSetup() {
  stubOrganizations();
  stubStacks();
}

module('Acceptance: Databases Paginated Operations', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit /apps/:id/activity requires authentication', function() {
  doSetup();
  expectRequiresAuthentication('/databases/1/activity');
});

test('visit /databases/:id/activity shows operations', function() {
  doSetup();
  resourceOperationsTest(sharedTestOptions);
});

test('visit /databases/:id/activity does pagination', function() {
  doSetup();
  paginatedResourceTest(sharedTestOptions);
});

test('visit /databases/:id/activity updates query params when changing page', function() {
  doSetup();
  paginatedResourceUpdatesQueryParamsTest(sharedTestOptions);
});

test('visit /databases/:id/activity?page=2 starts at 2nd page', function() {
  doSetup();
  paginatedResourceQueryParamsPage2Test(sharedTestOptions);
});
