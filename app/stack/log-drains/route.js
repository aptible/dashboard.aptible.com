import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    let stack = this.modelFor('stack');

    return stack.get('logDrains');
  }
});
