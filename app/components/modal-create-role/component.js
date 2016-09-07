import Ember from 'ember';
import EmberValidationsMixin from "ember-validations/mixin";

export default Ember.Component.extend(EmberValidationsMixin, {
  newRole: null,
  disableSave: Ember.computed.or('hasError', 'isPending'),
  isPending: Ember.computed.or('newRole.isSaving', 'newRole.isValidating'),
  hasError: Ember.computed.gt('errors.newRole.handle.length', 0),
  title: Ember.computed('authorizationContext.organization.name', function() {
    return `Create a new role for ${this.get('authorizationContext.organization.name')}`;
  }),

  description: '',

  dismissOnSave: Ember.observer('newRole.id', function() {
    if(!this.get('newRole.isNew')) {
      if (!this.isDestroyed) {
        this.sendAction('dismiss');
      }
    }
  }),

  validations: {
    'newRole.name': {
      presence: true,
      length: { minimum: 3 }
    }
  },

  focusHandle: Ember.on('didInsertElement', function() {
    Ember.run.later(() => {
      this.$('input').eq(0).focus();
    });
  }),

  actions: {
    onDismiss() {
      this.get('newRole').rollback();
      this.sendAction('dismiss');
    },

    createRole() {
      let role = this.get('newRole');
      this.sendAction('onCreateRole', role);
    },

    outsideClick: Ember.K
  }
});
