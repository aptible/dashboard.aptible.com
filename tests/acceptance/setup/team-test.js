import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from 'sheriff/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';

let application;

module('Acceptance: Setup: Team', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

skip('Team shows all organization users');
skip('Changing team compliance roles');
skip('Pending invitations tab shows all pending invitations');
skip('Inviting new users');
skip('Clicking continue saves team attestation');