import Ember from 'ember';
import Location from "diesel/utils/location";
import ajax from "diesel/utils/ajax";
import config from 'diesel/config/environment';

export default Ember.Route.extend({
  model: function() {
    return Ember.Object.create({
      email: '',
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
          subject_token: authAttempt.get('email'),
          subject_token_type: 'aptible:user:email',
          scope: authAttempt.get('manage') ? 'manage' : 'read'
      };

      this.controller.set('inProgress', true);
      this.currentModel.set('error', null);

      // Log out and then log back in as the impersonated user
      this.session.close('application', {noDelete: true})
      .then(() => {
        return this.session.open('application', credentials);
      })
      .then(() => {
        // Do *not* pass withCredentials to avoid clearing *user* session cookie.
        return ajax(`${config.authBaseUri}/tokens/${adminToken.get('id')}`, {
          type: 'DELETE',
          headers: {'Authorization': 'Bearer ' + adminToken.get('accessToken')}
        });
      }, (e) => {
        // Log back in as the (presumed) admin user and propagate the error.
        return this.session.open('application', {token: adminToken}).then(() => {throw e;});
      })
      .then(() => {
        // At this point we know impersonation has succeeded. Merely transitioning to 'index'
        // may or may not work, depending on whether some data has been loaded as the superuser
        // and has stuck around in the store. We can't really clear out the store either, considering
        // our session data is stored in there. So: we just reload the page to get a clean slate.
        return Location.replaceAndWait('/');
      }, (e) => {
        this.currentModel.set('error', `Error: ${e.message || JSON.stringify(e)}`);
      })
      .finally(() => {
        this.controller.set('inProgress', false);
      });
    }
  }
});
