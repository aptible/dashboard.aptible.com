import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'i',
  classNames: ['compliance-icon fa'],
  classNameBindings: ['isGreen:fa-check-circle', 'isRed:fa-times-circle'],
  isGreen: Ember.computed.equal('status.green', true),
  isRed: Ember.computed.not('status.green')
});
