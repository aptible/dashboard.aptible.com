import StackResourceAdapter from './stack-resource';
import Ember from 'ember';
const pluralize = Ember.String.pluralize;
const decamelize = Ember.String.decamelize;
const underscore = Ember.String.underscore;

export default StackResourceAdapter.extend({
  // In URLs and JSON payloads, use "log_drains" instead of "logDrains" or "log-drains"
  pathForType: function(type){
    return underscore(pluralize(decamelize(type)));
  }
});

