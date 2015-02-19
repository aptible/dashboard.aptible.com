import Ember from 'ember';

export default Ember.Component.extend({
  organizationGroups: function() {
    var groups = [];

    this.get('stacks').forEach(function(stack) {
      var currentOrganizationId = stack.get('_data.links.organization');
      var currentOrganization = stack.get('organization');
      var group = groups.findBy('organizationId', currentOrganizationId);

      if (!group) {
        group = {
          organizationId: currentOrganizationId,
          organization: currentOrganization,
          stacks: []
        };
        groups.push(group);
      }

      group.stacks.push(stack);
    });

    return groups;
  }.property('stacks.[]')
});