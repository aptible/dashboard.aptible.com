import Ember from 'ember';

export default Ember.Route.extend({
  redirect: function(){
    var stacks = this.modelFor('stacks');
    var stack = stacks.objectAt(0);

    if(stacks.get('length') === 0) {
      this.replaceWith('welcome.first-app');
    } else if(stacks.get('length') === 1) {
      this.replaceWith('apps', stack);
    }
  }
});
