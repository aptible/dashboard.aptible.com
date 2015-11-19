import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  analytics: Ember.inject.service(),
  location: config.locationType,
  onTransition: function() {
    this.get('analytics').page();
    this.get('flashMessages').clearMessages();
  }.on('didTransition')
});

Router.map(function() {
  this.authenticatedRoute('organization', { path: ':organization_id'}, function() {
    this.route("training", { path: 'training', resetNamespace: true }, function() {
      this.route("criterion", { path: ':criterion_handle' }, function() {});
    });
  });
});

export default Router;
