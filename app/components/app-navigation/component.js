import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Component.extend({
  tagName: 'ul',
  classNames: ['nav', 'nav-pills', 'application-nav'],
  showSheriff: config.featureFlags['sheriff']
});
