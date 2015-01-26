import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['container', 'focus'],
  elementId: 'main-yield-wrapper',

  didInsertElement: function(){
    this.element.setAttribute('style', 'min-height: 873px');
  }
});
