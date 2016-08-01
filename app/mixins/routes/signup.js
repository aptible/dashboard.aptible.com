import Ember from 'ember';
import { buildCredentials } from "diesel/login/route";

export default Ember.Mixin.create({
  actions: {
    signup(user, organization){
      let { email, password } = user.getProperties('email', 'password');
      this.controller.set('isSaving', true);

      user.save().then(() => {
        let credentials = buildCredentials(email, password);
        return this.get('session').open('application', credentials);
      }).then(() => {
        if (organization) {
          // standard signup flow, create organization at the same time
          return organization.save().then(() => {
            let roles = this.session.get('currentUser.roles');
            // Roles are used to determine the visibility of nav items once
            // signup is complete.  We should force a reload here since
            // organization#create bootstraps several roles for this user.
            // We dont' need to wait on these since they won't be used
            // immediately.

            if(roles.get('isFulfilled')) {
              roles.reload();
            }

            this.transitionTo('welcome.first-app', organization.get('id'));
            this.controller.set('isSaving', false);
          });
        } else {
          // accepting invitation, redirect to accept page
          let invitationId     = this.controller.get('invitation.id');
          let verificationCode = this.controller.get('verificationCode');

          this.transitionTo('claim', invitationId, verificationCode);
        }
      }, () => {
        this.controller.set('isSaving', true);
      });
    }
  }
});
