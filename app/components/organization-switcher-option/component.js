import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['organization-switcher-item'],
  classNameBindings: ['isActive:active'],
  isActive: Ember.computed('organization.id', 'currentOrganization.id', function() {
    return this.get('organization.id') === this.get('currentOrganization.id');
  })
});
