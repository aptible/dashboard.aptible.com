import Ember from "ember";
import Location from '../utils/location';
import Cookies from 'ember-cli-aptible-shared/utils/cookies';
import config from '../config/environment';

export const AFTER_AUTH_COOKIE = 'afterAuthUrl';
export const accessDenied = {};
const TWO_MINUTES_IN_DAYS = 0.0014;

export default Ember.Route.extend({
  actions: {
    accessDenied() {
      Cookies.create(AFTER_AUTH_COOKIE, window.location, TWO_MINUTES_IN_DAYS);
      Location.replace(config.dashboardBaseUri+'/login');
      return new Ember.RSVP.Promise((resolve, reject) => {
        accessDenied.lastResolve = resolve;
        accessDenied.lastReject = reject;
      });
    }
  }
});