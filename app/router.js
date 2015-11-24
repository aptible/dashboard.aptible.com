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

    this.route("engines", { path: '', resetNamespace: true }, function() {
      this.route("training", { path: 'training', resetNamespace: true }, function() {
        this.route("criterion", { path: ':criterion_handle' }, function() {});
      });
      this.route('risk');
      this.route('policies');
      this.route('security');
      this.route('contracts');
      this.route('incidents');
    });

    this.route('setup', { path: 'setup', resetNamespace: true}, function() {
      this.route('start');
      this.route('organization');
      this.route('locations', {}, function() {
        this.modal('add-location-modal', {
          withParams: ['newLocation'],
          otherParams: ['document', 'schema', 'newLocation'],
          dismissWithOutsideClick: false
        });
      });
      this.route('team');
      this.route('data-environments');
      this.route('security-controls');
      this.route('finish');
    });
  });
});

export default Router;
