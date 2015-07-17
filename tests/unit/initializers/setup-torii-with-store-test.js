import Ember from 'ember';
import {module, test} from 'qunit';
import { initialize } from 'diesel/initializers/setup-torii-with-store';

var container, application;

module('SetupToriiWithStoreInitializer', {
  beforeEach: function() {
    Ember.run(function() {
      container = new Ember.Container();
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  initialize(container, application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});

