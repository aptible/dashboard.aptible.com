import Ember from 'ember';

export default Ember.Component.extend({
  organizationGroups: function() {
    var groups = Ember.A([]);

    this.get('stacks').forEach(function(stack) {
      var currentOrganizationId = stack.get('_data.links.organization');
      var currentOrganization = stack.get('organization');

      if(!groups.findBy('organizationId', currentOrganizationId)) {
        groups.addObject(Ember.Object.create({
          organizationId: currentOrganizationId,
          organization: currentOrganization,
          stacks: Ember.A([])
        }));
      }

      groups.findBy('organizationId', currentOrganizationId).get('stacks').addObject(stack);
    });

    return groups;
  }.property('stacks')
});