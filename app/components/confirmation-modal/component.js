import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  confirmationModalService: Ember.inject.service('confirmation-modal'),
  layout: layout,

  model: Ember.computed.reads('modal.model'),

  startConfirmationModalServiceListener: function() {
    this._super.apply(this, arguments);
    this.get('confirmationModalService').on('open', (modal) => {
      this.set('modal', modal);
      this.set('isOpen', true);
    });
  }.on('init'),

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
