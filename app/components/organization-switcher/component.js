import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['current-organization'],
  organizationContext: Ember.inject.service()
});
