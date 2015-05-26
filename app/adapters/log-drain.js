import ApplicationAdapter from './application';
import buildURLWithPrefixMap from '../utils/build-url-with-prefix-map';
import Ember from 'ember';
const pluralize = Ember.String.pluralize;
const decamelize = Ember.String.decamelize;
const underscore = Ember.String.underscore;

export default ApplicationAdapter.extend({
  buildURL: buildURLWithPrefixMap({
    'accounts': {property: 'stack.id'}
  }),

  // In URLs and JSON payloads, use "log_drains" instead of "logDrains" or "log-drains"
  pathForType: function(type){
    return underscore(pluralize(decamelize(type)));
  }
});
