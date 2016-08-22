import Ember from 'ember';
import { module, skip } from 'qunit';
import startApp from '../../helpers/start-app';

let application;

module('Acceptance: Setup: FTUX', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

skip('First time user experience');
skip('Clicking continue takes you to organization settings');