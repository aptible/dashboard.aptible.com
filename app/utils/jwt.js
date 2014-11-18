import Ember from 'ember';
import Base64 from './base64';

export default Ember.Object.extend({
  token: null,

  payload: function(){
    var token = this.get('token');

    if (!token) { return {}; }

    var parts = token.split('.');

    Ember.assert('JWT token is missing payload section: %@'.fmt(token),
                 parts[1]);

    try {
      var decoded = Base64.decode(parts[1]);
      return JSON.parse(decoded);
    } catch(e) {
      throw new Error('JWT token has invalid payload: ' + token);
    }
  }.property('token')
});
