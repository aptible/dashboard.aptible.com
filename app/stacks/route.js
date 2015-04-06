import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    let stacks = this.store.find('stack');

    if (stacks.get('isFulfilled')) {
      stacks = stacks.reload();
    }

    return Ember.RSVP.hash({
      stacks: stacks,
      organizations: this.store.find('organization')
    });
  },
  afterModel: function(model){
    var stacks = model.stacks;
    var stack = stacks.objectAt(0);

    if(stacks.get('length') === 0) {
      this.transitionTo('welcome.first-app');
    } else {
      this.transitionTo('apps', stack);
    }
  }
});
