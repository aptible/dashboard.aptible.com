import Ember from 'ember';

export default Ember.Component.extend({
  newCertificate: null,
  disableSave: Ember.computed.or('hasError', 'isPending'),
  isPending: Ember.computed.or('newCertificate.isSaving', 'newCertificate.isValidating'),
  hasError: Ember.computed.gt('errors.length', 0),

  title: Ember.computed('stack.handle', function() {
    return `Create a new certificate on ${this.get('stack.handle')}`;
  }),

  description: Ember.computed('stack.allowPHI', function () {
    return `Adding a certificate to ${this.get('stack.handle')} will allow you
            to provision app endpoints with custom domains.`;
  }),

  dismissOnSave: Ember.observer('newCertificate.isNew', function() {
    if(this.get('newCertificate.isNew') === false) {
      if (!this.isDestroyed) {
        this.sendAction('dismiss');
      }
    }
  }),

  focusHandle: Ember.on('didInsertElement', function() {
    Ember.run.later(() => {
      this.$('input').eq(0).focus();
    });
  }),

  actions: {
    onDismiss() {
      this.get('newCertificate').rollback();
    },

    createCertificate() {
      let certificate = this.get('newCertificate');
      this.sendAction('onCreateCertificate', certificate);
    },

    outsideClick: Ember.K
  }
});
