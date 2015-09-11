import Ember from "ember";
import MockLocation from '../helpers/mock-location';
import Cookies from 'ember-cli-aptible-shared/utils/cookies';
import { AFTER_AUTH_COOKIE, accessDenied } from '../../application/route';
import config from '../../config/environment';
import { stubRequest } from 'ember-cli-fake-server';

Ember.Test.registerAsyncHelper('expectRequiresAuthentication', function(app, url){
  var returnLocation = window.location;
  visit(url);
  Ember.run.later(this, () => {
    accessDenied.lastReject();
  }, 200);
  andThen(function() {
    equal(MockLocation.last(), config.dashboardBaseUri+'/login', `redirected to dashboard for login`);
    equal(Cookies.read(AFTER_AUTH_COOKIE), returnLocation, `cookie for redirect set`);
  });
});
