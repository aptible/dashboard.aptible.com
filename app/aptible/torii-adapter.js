import Ember from "ember";
import storage from '../utils/storage';
import config from "../config/environment";
import ajax from "../utils/ajax";
import JWT from '../utils/jwt';
import { auth } from '../application/adapter';

export default Ember.Object.extend({
  fetch: function(){
    var token;

    return new Ember.RSVP.Promise(function(resolve){
      token = storage.read(config.authTokenKey);

      if (token) {
        resolve(token);
      } else {
        throw new Error('Token not found');
      }
    }).then(function(token){
      auth.token = token;
      var jwt = JWT.create({token:token});
      return jwt.get('payload');
    }).then(function(payload){
      return ajax(payload.sub, {
        type: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
    }).catch(function(e){
      delete auth.token;
      storage.remove(config.authTokenKey);
      throw e;
    });
  },

  open: function(tokenResponse){
    return new Ember.RSVP.Promise(function(resolve){
      auth.token = tokenResponse.access_token;
      storage.write(config.authTokenKey, tokenResponse.access_token);
      resolve();
    });
  },

  close: function(){
    return new Ember.RSVP.Promise(function(resolve){
      delete auth.token;
      storage.remove(config.authTokenKey);
      resolve();
    });
  }
});
