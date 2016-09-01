import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

let application;

function doSetup() {
  stubOrganization();
  stubProfile({ hasCompletedSetup: true });
  stubCriterionDocuments({});
  stubCriteria();
  stubStacks();
  signInAndVisit('/', {}, { type: 'compliance_user' });
}

module('Acceptance: Trainee Dashboard', {
  beforeEach() {
    application = startApp();
    doSetup();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('visiting / without read access on any stacks redirects to the gridiron-user', function(assert) {
  andThen(function() {
    assert.equal(currentPath(), 'gridiron.gridiron-organization.gridiron-user',
                'redirected to "My Gridiron" page');
  });
});
