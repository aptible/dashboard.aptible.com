import Ember from "ember";
import { createToken, getPersistedToken } from "diesel/utils/tokens";

const ELEVATED_SCOPE = "elevated";

export default Ember.Service.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),

  isElevated() {
    let currentTokenScope = this.get("session.token.scope");
    return currentTokenScope === ELEVATED_SCOPE;
  },

  tryDropPrivileges(transition) {
    if (!this.isElevated()) {
      // Current token is not elevated. There are no privileges to drop.
      return;
    }

    if (transition.targetName.indexOf("requires-elevation") >= 0) {
      // We're navigating to a route that requires elevation. Don't drop privileges.
      return;
    }

    if (this.persistedTokenIsElevated) {
      // We're in an odd situation where the persisted token is elevated. This
      // is not ideal, and should not happen (that's a security concern,
      // handled by specifically not persisting the elevated token), but we
      // need to keep going; otherwise we're going to just hang the UI.
      // TODO: Maybe we should just delete the token and reload?
      return;
    }

    // Note: We'd like to just return a promise before the transition happens,
    // but that's not possible, so instead we'll abort the transition, and then
    // retry it as soon as we've swapped out the token.
    transition.abort();
    return this.restorePersistedToken().then(() => {
      transition.retry();
    });
  },

  reopenSession(tokenPayload) {
    // TODO: Option to delete. Option to persist? Will probably be needed for
    // impersonation.
    let sessionService = this.get("session");
    return sessionService.close('application', { noDelete: true }).then(() => {
      return sessionService.open('application', { tokenPayload });
    });
  },

  createElevatedToken(credentials) {
    // NOTE: Toggle noPersist below if you're developing on the settings page
    // and don't want to have to input your password (and possibly 2FA token)
    // over and over again.
    credentials.scope = ELEVATED_SCOPE;
    credentials.expires_in = 30 * 60;  // 30 minutes.
    return createToken(credentials, { noPersist: true }).then((tokenPayload) => {
      return this.reopenSession(tokenPayload);
    });
  },

  restorePersistedToken() {
    // Restores a regular token from the session.
    return getPersistedToken().then((tokenPayload) => {
      if (tokenPayload.scope === ELEVATED_SCOPE) {
        this.persistedTokenIsElevated = true;
      }

      return this.reopenSession(tokenPayload);
    });
  }
});
