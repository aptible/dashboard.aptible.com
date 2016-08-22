import ajax from "../utils/ajax";
import config from "../config/environment";
import { getAccessToken } from '../adapters/application';

function rethrowJqXhrError(jqXHR) {
  // TODO: Use this everywhere.
    if (jqXHR.responseJSON) {
      let err = new Error(jqXHR.responseJSON.message);
      err.authError = jqXHR.responseJSON.error;
      throw err;
    } else if (jqXHR.responseText) {
      throw new Error(jqXHR.responseText);
    } else {
      throw new Error("Unknown error from the server.");
    }
}

export function createToken(credentials, options) {
  // Accepted options:
  // - `noPersist` (defaults to `false`): don't persist the token as a cookie.
  options = options || {};

  return ajax(config.authBaseUri + '/tokens', {
    type: 'POST',
    data: credentials,
    xhrFields: {
      withCredentials: !options.noPersist
    }
  }).catch(rethrowJqXhrError);
}

export function getPersistedToken() {
  return ajax(config.authBaseUri + '/current_token', {
    type: 'GET',
    xhrFields: {
      withCredentials: true
    }
  }).catch(rethrowJqXhrError);
}

export function revokeAllAccessibleTokens(options) {
  options = options || {};

  return ajax(config.authBaseUri + '/tokens/revoke_all_accessible', {
    type: 'POST',
    data: {
      except_tokens: options.exceptTokenHrefs
    },
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`
    }
  }).catch(rethrowJqXhrError);
}
