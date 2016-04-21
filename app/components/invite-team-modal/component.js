import Ember from 'ember';
import { VALID_EMAIL_REGEX } from 'sheriff/validators/email';

var title = `Invite your workforce`;
var description = `Any member of your workforce with access to PHI is required
                   to perform Basic HIPAA Training. Use the form below to invite
                   those individuals into your Aptible organization.  Once they
                   accept their invitation to join you on Aptible, they will be
                   automatically enrolled in Basic HIPAA Training`;

export const EMAIL_STRING_DELIMITER = /[,|;|\s]+/;

export default Ember.Component.extend({
  classNames: ['invite-team'],
  errors: null,
  isSending: false,

  init() {
    this._super(...arguments);
    this.setProperties({ title, description });
  },

  splitInviteList: Ember.computed('invitesList', function() {
    let inviteListString = this.get('invitesList');
    return inviteListString.split(EMAIL_STRING_DELIMITER).filter((email) => {
      return !!Ember.$.trim(email);
    });
  }),

  validEmails: Ember.computed.filter('splitInviteList', function(email) {
    return VALID_EMAIL_REGEX.exec(email);
  }),

  invalidEmails: Ember.computed.setDiff('splitInviteList', 'validEmails'),

  validate() {
    let error = null;
    let { invalidEmails, role } = this.getProperties('invalidEmails', 'role');

    if (!role) {
      error = `Error: A role is required`;
    } else if (invalidEmails.length > 0) {
      let invalid = invalidEmails.join(', ');
      error = `Error: The following emails are invalid: ${invalid}`;
    }

    return this.set('errors', error);
  },

  actions: {
    clearMessages() {
      this.set('errors', null);
    },

    onDismiss() {
      this.set('errors', null);
      this.sendAction('dismiss');
    },

    updateRole() {
      let value = this.$('select').val();
      this.set('role', value);
    },

    sendInvitations() {
      this.validate();

      if (this.get('errors')) {
        return false;
      }

      let { validEmails, role } = this.getProperties('validEmails', 'role');

      this.sendAction('dismiss');
      this.sendAction('inviteTeam', validEmails, role);
    },

    outsideClick: Ember.K
  }
});
