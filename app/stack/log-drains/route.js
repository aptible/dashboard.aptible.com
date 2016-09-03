import Ember from 'ember';

export default Ember.Route.extend({
  title() {
    let stack = this.modelFor('stack');
    return `${stack.get('handle')} Log Drains`;
  },

  model(){
    let stack = this.modelFor('stack');
    return stack.get('logDrains');
  },

  redirect() {
    var stack = this.modelFor('stack');

    if(stack.get('logDrains.length') === 0) {
      this.replaceWith('stack.log-drains.new', this.modelFor('stack'));
    }
  },
});
