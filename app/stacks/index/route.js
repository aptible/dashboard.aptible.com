import Ember from 'ember';

export default Ember.Route.extend({
  redirect: function(){
    var stacks = this.modelFor('stacks');
    var stack = stacks.objectAt(0);
    this.replaceWith('apps', stack);
  }
});
