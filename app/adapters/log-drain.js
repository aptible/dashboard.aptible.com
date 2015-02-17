import ApplicationAdapter from './application';
import Ember from 'ember';

export default ApplicationAdapter.extend({
  // In URLs and JSON payloads, use "log_drains" instead of "logDrains"
  pathForType: function(type){
    return Ember.String.pluralize( Ember.String.decamelize(type) );
  }
});
