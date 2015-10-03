import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      stacks: this.store.find('stack'),
      organizations: this.store.find('organization')
    });
  }
});
