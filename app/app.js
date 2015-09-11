import Ember from 'ember';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';
import { RouteExtension, RouterExtension } from 'diesel/utils/title-route-extensions';
import monkeyPatchRaven from './ext/raven';

Ember.Route.reopen(RouteExtension);
Ember.Router.reopen(RouterExtension);

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);
monkeyPatchRaven();

export default App;
