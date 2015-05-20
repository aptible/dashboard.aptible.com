import Ember from 'ember';
import Base64 from './base64';

export default Ember.Object.extend({
  token: null,

  payload: Ember.computed('token', function() {
    var token = this.get('token');

    if (!token || token === "null") { return {}; }

    var parts = token.split('.');

    Ember.assert(Ember.String.fmt('JWT token is missing payload section: %@', token),
                 parts[1]);

    try {
      var decoded = Base64.decode(parts[1]);
      return JSON.parse(decoded);
    } catch(e) {
      throw new Error('JWT token has invalid payload: ' + token);
    }
  })
});
