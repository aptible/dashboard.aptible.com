import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from '../helpers/start-app';

let application;

function doSetup() {
  stubOrganizations();
  stubStacks();
  // Ensure the current user's role is NOT an owner
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
    assert.equal(currentPath(), 'gridiron-user');
  });
});
