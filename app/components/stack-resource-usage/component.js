import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  isDisk: Ember.computed.equal('resource', 'disk'),
  isDomain: Ember.computed.equal('resource', 'domain'),
  isContainer: Ember.computed.equal('resource', 'container')
});
