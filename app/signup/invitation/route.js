import Ember from 'ember';
import DisallowAuthenticated from "diesel/mixins/routes/disallow-authenticated";
import SignupRouteMixin from "diesel/mixins/routes/signup";

export default Ember.Route.extend(DisallowAuthenticated, SignupRouteMixin, {
  model(params){
    let invitationId = params.invitation_id;
    let verificationCode = params.verification_code;

    return this.store.find('invitation', invitationId).then( (invitation) => {
      return { invitation, verificationCode };
    });
  },

  setupController: function(controller, model){
    let {invitation, verificationCode} = model;
    Ember.assert(`This route's model hook must be passed an invitation id and verification code`,
                 invitation && verificationCode);

    let user = this.store.createRecord('user');
    user.set('email', invitation.get('email'));

    controller.set('model', user);

    // used later to redirect user back to accept invitation
    controller.set('invitation', invitation);
    controller.set('verificationCode', verificationCode);
  }
});

