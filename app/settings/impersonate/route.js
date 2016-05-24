import Ember from 'ember';
import Location from "diesel/utils/location";
import { createToken } from "diesel/utils/tokens";

function prepareSubjectParameters(email, organizationHref) {
  if (email) {
    return {
      subject_token: email,
      subject_token_type: 'aptible:user:email',
    };
  } else if (organizationHref) {
    return {
      subject_token: organizationHref,
      subject_token_type: 'aptible:organization:href',
    };
  } else {
    return {};
  }
}

export default Ember.Route.extend({
  model: function() {
    return Ember.Object.create({
      email: '',
      organizationHref: '',
      manage: false
    });
  },

  actions: {
    impersonate: function(authAttempt) {
      let adminToken = this.get("session.token");

      let credentials = {
          grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
          actor_token: adminToken.get('accessToken'),
          actor_token_type: 'urn:ietf:params:oauth:token-type:jwt',
          scope: authAttempt.get('manage') ? 'manage' : 'read'
      };

      Ember.merge(credentials, prepareSubjectParameters(authAttempt.email, authAttempt.organizationHref));

      this.controller.set('inProgress', true);
      this.currentModel.set('error', null);

      // To impersonate a user, this will first attempt to create a token for
      // them and persist it to our cookies. If that succeeds, then all we need
      // to do is destroy our admin token (without persisting that change to
      // cookies) and reload the UI: upon reload the new token will be fetched
      // from cookies, and we'll be logged in as whoever we intended to
      // impersonate. If it fails, then we don't have to clean up anything
      // (since nothing was created).
      return createToken(credentials).then(() => {
        return this.session.close('application', {
          token: adminToken,
          noClearCookies: true
        });
      }).then(() => {
        return Location.replaceAndWait('/');
      }).catch((e) => {
        this.currentModel.set('error', `Error: ${e.message || JSON.stringify(e)}`);
      }).finally(() => {
        this.controller.set('inProgress', false);
      });
    }
  }
});
