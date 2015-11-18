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
  this.authenticatedRoute('organization', { path: ':organization_id'}, function() {

    this.route("engines", { path: '', resetNamespace: true }, function() {
      this.route("training", { path: 'training', resetNamespace: true }, function() {
        this.route("criterion", { path: ':criterion_handle' }, function() {});
      });
    });

    this.route('setup', { path: 'setup', resetNamespace: true}, function() {
      this.route('start');
      this.route('organization');
      this.route('locations');
      this.route('team');
      this.route('data-environments');
      this.route('security-controls');
      this.route('finish');
    });
  });
});

export default Router;
