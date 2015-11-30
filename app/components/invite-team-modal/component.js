import Ember from 'ember';
import { VALID_EMAIL_REGEX } from 'sheriff/validators/email';

var title = `Invite your workforce`;
var description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                   Donec aliquet purus ornare condimentum malesuada.
                   Pellentesque diam mi, fermentum ut sapien eu, vehicula
                   dictum elit. Integer cursus sagittis ullamcorper`;

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
    return inviteListString.split(EMAIL_STRING_DELIMITER);
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

      this.sendAction('inviteTeam', validEmails, role);
      this.sendAction('dismiss');
    },

    outsideClick: Ember.K
  }
});
