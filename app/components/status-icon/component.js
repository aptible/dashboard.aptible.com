import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'i',
  classNames: ['fa fa-check'],
  classNameBindings: ["status"],

  attributeBindings: ['title'],
  title: Ember.computed.alias('status'),

  didInsertElement: function(){
    // Ember has a feature called attributeBindings, but these
    // are all static. Adding them by hand is an optimization.
    this.element.setAttribute('data-placement', 'bottom');
    this.element.setAttribute('data-toggle', 'tooltip');
    this.element.setAttribute('data-original-title', 'Provisioned Successfully');
  }

});

