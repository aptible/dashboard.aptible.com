import Ember from 'ember';

export default Ember.Service.extend({
  complianceStatus: Ember.inject.service(),
  organizationHref: Ember.computed(function() {
    return this.get('complianceStatus.organization.data.links.self');
  })
});
