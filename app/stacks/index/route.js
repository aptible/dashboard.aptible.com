import Ember from 'ember';

export default Ember.Route.extend({
  redirect: function(){
    var stacks = this.modelFor('stacks');
    var stack = stacks.objectAt(0);
    if (stack) {
      this.replaceWith('apps', stack);
    } else {
      this.replaceWith('welcome.first-app');
    }
  }
});
