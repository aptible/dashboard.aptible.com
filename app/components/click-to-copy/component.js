/*global Clipboard*/
import Ember from 'ember';

export default Ember.Component.extend({
  actionLabel: 'Copy',
  classNames: ['click-to-copy'],
  Clipboard: Clipboard,
  errorMessage: 'Press ⌘+C to copy',
  isTooltipped: false,
  message: null,
  successMessage: 'Copied!',
  tagName: 'span',
  text: null,

  dataClipboardText: Ember.computed.alias('text'),

  attributeBindings: ['dataClipboardText:data-clipboard-text',
                      'message:data-message'],

  classNameBindings: ['isTooltipped:tooltipped'],

  setupClipboard: Ember.on('didInsertElement', function(){
    this.clipboard = new this.Clipboard('#' + this.elementId);
    this.clipboard.on('success', Ember.run.bind(this, 'success'));
    this.clipboard.on('error', Ember.run.bind(this, 'error'));
  }),

  success: function(){
    this.set('message', this.successMessage);
    this.showMessage();
  },

  error: function(){
    this.set('message', this.errorMessage);
    this.showMessage();
  },

  showMessage: function() {
    this.set('isTooltipped', true);

    Ember.run.later(() => {
      if (!this.isDestroying && !this.isDestroyed) {
        this.set('isTooltipped', false);
      }
    }, 3000);
  }
});
