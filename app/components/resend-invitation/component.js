import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '', // tagless component

  store: Ember.inject.service(),
  invitation: null,

  actions: {
    resend(){
      let invitation = this.get('invitation');
      let invitationId = this.get('invitation.id');
      let reset = this.get('store').createRecord('reset');
      reset.setProperties({
        type: 'invitation',
        invitationId
      });

      reset.save().then( () => {
        this.sendAction('action', invitation);
      });
    }
  }
});
