import Ember from 'ember';

export default Ember.Component.extend({
  organizationStacks: function() {
    return this.get('stacks').filterBy('organization.id', this.get('organization.id'));
  }.property('stacks.[]', 'stacks.@each.organization.id', 'organization.id')
});