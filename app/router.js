import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('apps', {}, function(){
    // show an individual app
    this.route('new');
    this.route('show', {path: '/:app_id'});
  });
  this.route('databases', {}, function(){
    this.route('show', {path: '/:database_id'});
  });
  this.route('login');
  this.route('logout');
  this.route('stack', {path: 'stacks/:stack_id'}, function(){
    this.route('new-database', {path: 'databases/new'});
    this.route('new-app', {path: 'apps/new'});
  });
});

export default Router;
