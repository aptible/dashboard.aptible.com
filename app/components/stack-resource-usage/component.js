import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  usage: Ember.computed('stack', 'resource', function() {
    let stack = this.get('stack');
    return stack.getUsageByResourceType(this.get('resource'));
  })
});