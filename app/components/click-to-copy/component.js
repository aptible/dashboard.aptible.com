/*global ZeroClipboard*/
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  copied: false,
  text: null,
  title: "Click to copy",

  'data-clipboard-text': Ember.computed.alias('text'),

  attributeBindings: ['data-clipboard-text', 'title'],

  setupClipboard: function(){
    this.clipboard = new ZeroClipboard( this.$() );
    this.clipboard.on('aftercopy', Ember.run.bind(this, 'afterCopy'));
  }.on('didInsertElement'),

  afterCopy: function(){
    this.set('copied', true);
    Ember.run.later(this, 'set', 'copied', false, 1500);
  },

  teardownClipboard: function(){
    if (this.clipboard) {
      this.clipboard.destroy();
    }
  }.on('willDestroyElement')
});
