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
  resourceType: 'apps'
};

function doSetup() {
  stubOrganizations();
  stubStacks();
}

module('Acceptance: Apps Paginated Operations', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit /apps/:id/activity requires authentication', function() {
  doSetup();
  expectRequiresAuthentication('/apps/1/activity');
});

test('visit /apps/:id/activity shows operations', function() {
  doSetup();
  resourceOperationsTest(sharedTestOptions);
});

test('visit /apps/:id/activity does pagination', function() {
  doSetup();
  paginatedResourceTest(sharedTestOptions);
});

test('visit /apps/:id/activity updates query params when changing page', function() {
  doSetup();
  paginatedResourceUpdatesQueryParamsTest(sharedTestOptions);
});

test('visit /apps/:id/activity?page=2 starts at 2nd page', function() {
  doSetup();
  paginatedResourceQueryParamsPage2Test(sharedTestOptions);
});
