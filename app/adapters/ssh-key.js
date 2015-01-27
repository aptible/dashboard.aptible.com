import AuthAdapter from './auth';
import buildURLWithPrefixMap from '../utils/build-url-with-prefix-map';
import Ember from 'ember';

export default AuthAdapter.extend({
  buildURL: buildURLWithPrefixMap({
    'users': 'user.id'
  }),

  // To delete an ssh-key, the adapter should send a DELETE to /ssh_keys/:id,
  // but it POSTs to /users/:user_id/ssh_keys.
  // Override deleteRecord to remove the "/users/:user_id" from the
  // url for a DELETE.
  deleteRecord: function(store, type, record){
    var id = Ember.get(record, 'id');
    var userId = Ember.get(record, 'user.id');

    var url = this.buildURL(type.typeKey, id, record);

    if (userId) {
      url = url.replace("/users/" + userId, "");
    }

    return this.ajax(url, "DELETE");
  },

  // In URLs and JSON payloads, use "ssh_keys" instead of "sshKeys"
  pathForType: function(type){
    return Ember.String.pluralize( Ember.String.decamelize(type) );
  }
});
