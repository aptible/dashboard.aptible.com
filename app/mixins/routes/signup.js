import Ember from 'ember';
import { buildCredentials } from "diesel/login/route";

export default Ember.Mixin.create({
  actions: {
    signup: function(user, organization){
      let {email, password} = user.getProperties('email', 'password');
      let plan = this.get('controller.plan') || 'development';
      this.controller.set('isSaving', true);

      user.save().then(() => {
        let credentials = buildCredentials(email, password);
        return this.get('session').open('application', credentials);
      }).then(() => {

        if (organization) {
          // standard signup flow, create organization at the same time
          return organization.save().then(() => {
            this.transitionTo('welcome.first-app', { queryParams: { plan: plan }});
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

