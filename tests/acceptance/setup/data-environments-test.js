import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from 'sheriff/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';

let application;

module('Acceptance: Setup: Data Environments', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

skip('Lists all data environments');
skip('Toggling data environments');
skip('Clicking continue saves data environment selections');
