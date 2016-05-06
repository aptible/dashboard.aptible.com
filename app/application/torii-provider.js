import Ember from 'ember';
import BaseProvider from "torii/providers/base";
import ajax from "../utils/ajax";
import config from "../config/environment";

export default BaseProvider.extend({
  open(credentials) {
    // If the credential has a "token", we just pass it right through
    // TODO: Check that it's an actual token object instead?
    let token = credentials.token;
    if (token !== undefined) {
      return new Ember.RSVP.Promise((resolve, _) => resolve(JSON.parse(token.get('rawPayload'))));
    }

    return ajax(config.authBaseUri+'/tokens', {
      type: 'POST',
      data: credentials,
      xhrFields: { withCredentials: true }
    }).catch(function(jqXHR){
      if (jqXHR.responseJSON) {
        let err = new Error(jqXHR.responseJSON.message);
        err.authError = jqXHR.responseJSON.error;
        throw err;
      } else if (jqXHR.responseText) {
        throw new Error(jqXHR.responseText);
      } else {
        throw new Error("Unknown error from the server.");
      }
    });
  }

});
