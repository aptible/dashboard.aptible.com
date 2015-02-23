import Ember from 'ember';

export default Ember.Route.extend({
  unauthenticatedRedirect: 'signup',

  model: function(params){
    return {
      verificationCode: params.verification_code,
      invitationId: params.invitation_id,
      type: 'invitation'
    };
  },

  actions: {
    claim: function(){
      var options = this.currentModel;
      var verification = this.store.createRecord('verification', options);

      verification.save().then( () => {
        this.replaceWith('index');
      }, () => {
        this.controllerFor('claim').set('error', `
          There was an error accepting this invitation. Perhaps
          the verification code has expired?
        `);
      });
    }
  }


});
