import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';
import AuthenticatedRouteMixin from './mixins/routes/authenticated';

// Calls reopen on route and router
import './utils/title-route-extensions';

Ember.MODEL_FACTORY_INJECTIONS = true;

Ember.Route.reopen(AuthenticatedRouteMixin);

var App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
