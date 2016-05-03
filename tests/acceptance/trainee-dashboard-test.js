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
  // Ensure the current user's role is NOT privileged
  signInAndVisit('/', {}, { privileged: false });
}

module('Acceptance: Trainee Dashboard', {
  beforeEach: function() {
    application = startApp();
    doSetup();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting / without read access on any stacks redirects to the trainee-dashboard', function(assert) {
  andThen(function() {
    assert.equal(currentPath(), 'trainee-dashboard');
  });
});
