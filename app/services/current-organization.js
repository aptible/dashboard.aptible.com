import Ember from 'ember';

export default Ember.Service.extend({
  organizationHref: Ember.computed(function() {
    // organizationRout is injected here in an initializer.
    // This seems wack, but I don't know a better way.
    return this.get('organizationRoute').modelFor('compliance-organization').get('data.links.self')
  })
});