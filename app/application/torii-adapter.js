import Ember from "ember";
import config from "../config/environment";
import ajax from "../utils/ajax";
import { getAccessToken, setAccessToken } from '../adapters/application';
import { getPersistedToken } from "../utils/tokens";

function clearSession(){
  setAccessToken(null);
}

function persistSession(accessToken){
  setAccessToken(accessToken);
}

function pushTokenToStore(tokenPayload, store) {
  return store.push('token', {
    id: tokenPayload.id,
    accessToken: tokenPayload.access_token,
    scope: tokenPayload.scope,
    rawPayload: JSON.stringify(tokenPayload),
    links: {
      user: tokenPayload._links.user.href,
      actor: tokenPayload._links.actor && tokenPayload._links.actor.href
    }
  });
}

export default Ember.Object.extend({
  store: Ember.inject.service(),
  analytics: Ember.inject.service(),

  _authenticateWithPayload(tokenPayload) {
    var store = this.get('store');
    return new Ember.RSVP.Promise(function(resolve){
      persistSession(tokenPayload.access_token);
      resolve(pushTokenToStore(tokenPayload, store));
    }).then((token) => {
      return Ember.RSVP.hash({
        token,
        currentUser: token.get('user'),
        currentActor: token.get('actor')
      });
    }).then((session) => {
      // Load role eagerly
      return session.currentUser.get('roles').then(() => {
        return session;
      });
    }).then((session) => {
      this.identifyToAnalytics(session.currentActor || session.currentUser);
      return session;
    }).catch(function(e){
      clearSession();
      throw e;
    });
  },

  fetch() {
    return getPersistedToken().then((tokenPayload) => this._authenticateWithPayload(tokenPayload));
  },

  open(tokenPayload) {
    return this._authenticateWithPayload(tokenPayload);
  },

  close(options) {
    options = options || {};
    let promise;

    if (!!options.noDelete) {
      promise = new Ember.RSVP.Promise((resolve, _) => resolve());
    } else {
      const token = options.token;
      Ember.assert(`A token must be passed: session.close('aptible', { token: /*token*/ });`, !!token);

      const xhrFields = {};
      if (!options.noClearCookies) {
        xhrFields.withCredentials = true;
      }

      promise = ajax(`${config.authBaseUri}/tokens/${token.get('id')}`, {
        type: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token.get("accessToken") || getAccessToken()
        },
        xhrFields: xhrFields
      });
    }

    return promise.then(() => { clearSession(); });
  },

  identifyToAnalytics(user) {
    const email = user.get('email');
    this.get('analytics').identify(user.get('id'), {
      email: email,
      id: user.get('id'),
      name: user.get('name'),
      createdAt: user.get('createdAt')
    });
  }

});
