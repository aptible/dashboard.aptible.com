import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('apps', {}, function(){
    // show an individual app
    this.route('show', {path: '/:app_id'});
  });
  this.route('databases', {}, function(){
    this.route('show', {path: '/:database_id'});
  });
  this.route('login');
  this.route('logout');
});

export default Router;
