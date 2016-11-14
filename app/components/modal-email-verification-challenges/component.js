import Ember from 'ember';

export default Ember.Component.extend({
  vhostToUpgrade: null,

  title: "Pending Email Verifications",

  description: Ember.computed("model.user.email", function() {
    return `Current email: ${this.get("model.user.email")}`;
  }),

  actions: {
    revokeEmailVerificationChallenge(challenge) {
      this.sendAction("revokeEmailVerificationChallenge", challenge);
    },

    onDismiss() {
      this.sendAction('dismiss');
    },

    outsideClick: Ember.K
  }
});
