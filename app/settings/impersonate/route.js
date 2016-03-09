import Ember from 'ember';
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
        return this.transitionTo('index');
      }, (e) => {
        this.currentModel.set('error', `Error: ${e.message || JSON.stringify()}`);
      })
      .finally(() => {
        this.controller.set('inProgress', false);
      });
    }
  }
});
