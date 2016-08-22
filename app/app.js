import Ember from 'ember';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';
import { RouteExtension, RouterExtension } from 'diesel/utils/title-route-extensions';
import bustFrames from 'diesel/utils/frame-buster';

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

bustFrames();

export default App;