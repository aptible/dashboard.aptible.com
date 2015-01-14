import Ember from 'ember';

export default Ember.Controller.extend({
  hasMultipleStacks: Ember.computed.gt('stacks.length', 1)
});
