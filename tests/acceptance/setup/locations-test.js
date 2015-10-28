import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from 'sheriff/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';

let application;

module('Acceptance: Setup: Locations', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('Locations page', function(assert) {
  stubValidOrganization();
  assert.ok(true);
});

skip('Visiting location page without completing previous step should return to previous step');
skip('Location schema is used to create add location form');
skip('Adding location adds to location index');
skip('Continue is disabled with no locations present');
skip('Clicking continue creates locations attestation');
