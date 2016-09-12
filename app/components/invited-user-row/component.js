import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  classNames: ['aptable__pending-invite-row'],
  requiredScope: 'manage',
  permittable: null,
  invitation: null,
  actions: {
    resendInvitation(invitation) {
      this.sendAction('resendInvitation', invitation);
    },

    destroyInvitation(invitation) {
      this.sendAction('destroyInvitation', invitation);
    },
  }
});
