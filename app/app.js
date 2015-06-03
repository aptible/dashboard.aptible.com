import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';
import AuthenticatedRouteMixin from 'sheriff/mixins/routes/authenticated';
import Location from './utils/location';
import { RouteExtension, RouterExtension } from 'sheriff/utils/title-route-extensions';

Ember.Route.reopen(RouteExtension);
Ember.Router.reopen(RouterExtension);

Ember.MODEL_FACTORY_INJECTIONS = true;

Ember.Route.reopen(AuthenticatedRouteMixin, {
  accessDenied() {
    Location.replace(config.dashboardBaseUri+'/login');
  }
});

var App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
