import AuthAdapter from './auth';
import buildURLWithPrefixMap from '../utils/build-url-with-prefix-map';
import Ember from 'ember';

export default AuthAdapter.extend({
  buildURL: buildURLWithPrefixMap({
    'users': {property: 'user.id', only:['create']}
  }),

  // In URLs and JSON payloads, use "ssh_keys" instead of "sshKeys"
  pathForType: function(type){
    return Ember.String.pluralize( Ember.String.decamelize(type) );
  }
});
