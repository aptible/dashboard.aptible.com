import Ember from 'ember';

export default Ember.Component.extend({
  confirmationModalService: Ember.inject.service('confirmation-modal'),
  classNames: ['flex-wrapper confirmation-modal-wrapper'],
  model: Ember.computed.reads('modal.model'),

  startConfirmationModalServiceListener: Ember.on('init', function() {
    this._super.apply(this, arguments);
    this.get('confirmationModalService').on('open', (modal) => {
      this.set('modal', modal);
      this.set('isOpen', true);
    });
  }),

  close() {
    this.set('isOpen', false);
    this.set('modal', null);
  },

  actions: {

    cancel() {
      let modal = this.get('modal');
      new Ember.RSVP.Promise((resolve) => {
        resolve(modal && modal.onCancel && modal.onCancel());
      }).then(() => {
        this.close();
      });
    },

    confirm() {
      let modal = this.get('modal');
      new Ember.RSVP.Promise((resolve) => {
        resolve(modal && modal.onConfirm && modal.onConfirm());
      }).then(() => {
        this.close();
      });
    }

  }
});
