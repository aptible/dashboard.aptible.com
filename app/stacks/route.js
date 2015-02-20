import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      stacks: this.store.find('stack'),
      organizations: this.store.find('organization')
    });
  },
  afterModel: function(model){
    var stacks = model.stacks;
    var stack = stacks.objectAt(0);

    if(stacks.get('length') === 0) {
      this.transitionTo('welcome.first-app');
    } else if(stacks.get('length') === 1) {
      this.transitionTo('apps', stack);
    }
  }
});
