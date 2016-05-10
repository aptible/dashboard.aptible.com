import Ember from 'ember';
import BaseProvider from "torii/providers/base";
import { createToken } from "../utils/tokens";

export default BaseProvider.extend({
  open(credentials) {
    // If the credential has a "token", we just pass it right through
    // TODO: Check that it's an actual token object instead?
    let token = credentials.token;
    if (token !== undefined) {
      return new Ember.RSVP.Promise((resolve, _) => resolve(JSON.parse(token.get('rawPayload'))));
    }

    // If it's a tokenPayload, same
    let tokenPayload = credentials.tokenPayload;
    if (tokenPayload !== undefined) {
      return new Ember.RSVP.Promise((resolve, _) => resolve(tokenPayload));
    }

    return createToken(credentials);
  }
});
