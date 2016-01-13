import Ember from 'ember';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';
import { RouteExtension, RouterExtension } from 'sheriff/utils/title-route-extensions';

Ember.Route.reopen(RouteExtension);
Ember.Router.reopen(RouterExtension);

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
