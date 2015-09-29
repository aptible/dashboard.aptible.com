import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: function() {
    let stack = this.modelFor('stack');
    return `${stack.get('handle')} Log Drains`;
  },

  model: function(){
    let stack = this.modelFor('stack');

    return stack.get('logDrains');
  },
  redirect: function() {
    var stack = this.modelFor('stack');
    if(stack.get('logDrains.length') === 0) {
      this.replaceWith('stack.log-drains.new', this.modelFor('stack'));
    }
  },
});
