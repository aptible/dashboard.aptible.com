import Ember from 'ember';
import startApp from '../helpers/start-app';
import MockLocation from '../helpers/mock-location';
import Cookies from 'ember-cli-aptible-shared/utils/cookies';
import { AFTER_AUTH_COOKIE, accessDenied } from '../../app';
import config from '../../config/environment';

var App;

module('Acceptance: Index', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

// FIXME should use expectRequiresAuthentication, but split from dashboard's
// version since the meaning is different
test('visiting / requires authentication', function() {
  var returnLocation = window.location;
  visit('/');
  Ember.run.later(this, () => {
    accessDenied.lastReject();
  }, 200);
  andThen(function() {
    equal(MockLocation.last(), config.dashboardBaseUri+'/login', `redirected to dashboard for login`);
    equal(Cookies.read(AFTER_AUTH_COOKIE), returnLocation, `cookie for redirect set`);
  });
});
