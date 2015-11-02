import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let organization = this.modelFor('organization');
    let store = this.store;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      store.find('organization-profile', organization.get('id'))
        .then((profile) => { resolve(profile) })
        .catch(() => { resolve(store.createRecord('organization-profile')) });
    });
  }
});
