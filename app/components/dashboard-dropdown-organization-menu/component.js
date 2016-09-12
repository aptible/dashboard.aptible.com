import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Component.extend({
  classNames: ['dashboard-dropdown-organization-menu'],
  showSheriff: config.featureFlags['sheriff']
});
