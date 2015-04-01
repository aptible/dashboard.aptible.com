import ApplicationAdapter from './application';
import buildURLWithPrefixMap from '../utils/build-url-with-prefix-map';
import Ember from 'ember';

export default ApplicationAdapter.extend({
  buildURL: buildURLWithPrefixMap({
    'accounts': {property: 'stack.id'}
  }),

  // In URLs and JSON payloads, use "log_drains" instead of "logDrains"
  pathForType: function(type){
    return Ember.String.pluralize( Ember.String.decamelize(type) );
  }
});
