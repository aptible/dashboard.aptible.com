import Ember from 'ember';
import { module, test, skip } from 'qunit';
import startApp from 'sheriff/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';

let application;

module('Acceptance: Setup: Security Controls', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

skip('Uses a schema document to show security control questions for each data environment');
skip('Uses a schema document to show security control questions for each provider');
skip('Uses a schema document to show global security control questions');
skip('Clicking continue saves attestation for each data environment');
