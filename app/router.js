import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  analytics: Ember.inject.service(),
  location: config.locationType,
  onTransition: function() {
    this.get('analytics').page();
    this.get('flashMessages').clearMessages();
  }.on('didTransition')
});

Router.map(function() {
  this.route('organization', { path: ':organization_id'}, function() {

    this.route("training", { path: 'training', resetNamespace: true }, function() {
      this.route("criterion", { path: ':criterion_handle' }, function() {});
    });

  });

  this.route('stacks', { path: 'stacks'}, function() {});
  this.route('settings', { path: 'settings'}, function() {
    this.route('ssh');
    this.route('admin');
    this.route('profile');
  });
});

export default Router;
