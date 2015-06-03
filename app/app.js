import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';
import AuthenticatedRouteMixin from 'sheriff/mixins/routes/authenticated';
import Location from './utils/location';
import { RouteExtension, RouterExtension } from 'sheriff/utils/title-route-extensions';
import Cookies from 'ember-cli-aptible-shared/utils/cookies';

export const AFTER_AUTH_COOKIE = 'afterAuthUrl';
export const accessDenied = {};
const TWO_MINUTES_IN_DAYS = 0.0014;

Ember.Route.reopen(RouteExtension);
Ember.Router.reopen(RouterExtension);

Ember.MODEL_FACTORY_INJECTIONS = true;

Ember.Route.reopen(AuthenticatedRouteMixin, {
  accessDenied() {
    Cookies.create(AFTER_AUTH_COOKIE, window.location, TWO_MINUTES_IN_DAYS);
    Location.replace(config.dashboardBaseUri+'/login');
    return new Ember.RSVP.Promise((resolve, reject) => {
      accessDenied.lastResolve = resolve;
      accessDenied.lastReject = reject;
    });
  }
});

var App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
