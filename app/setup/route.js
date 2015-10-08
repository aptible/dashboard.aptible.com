import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    //return {};
    return this.store.createRecord('organizationProfile')
  }
});
