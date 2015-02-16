import Ember from 'ember';
import { initialize } from 'diesel/initializers/setup-torii-with-store';

var container, application;

module('SetupToriiWithStoreInitializer', {
  setup: function() {
    Ember.run(function() {
      container = new Ember.Container(new Ember.Registry());
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function() {
  initialize(container, application);

  // you would normally confirm the results of the initializer here
  ok(true);
});

