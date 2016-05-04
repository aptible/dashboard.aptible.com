import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['data-environment'],
  tagName: 'tr',
  provider: Ember.computed.reads('property.displayProperties.provider')
});
