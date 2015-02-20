import Ember from 'ember';

export default Ember.Route.extend({
  title: function(){
    var stack = this.modelFor('stack');
    return `${stack.get('handle')} Databases - ${stack.get('organization.name')}`;
  },
  model: function(){
    var stack = this.modelFor('stack');
    var databases = stack.get('databases');
    if (databases.get('isFulfilled')) {
      return databases.reload();
    } else {
      return databases;
    }
  },
  redirect: function() {
    var stack = this.modelFor('stack');
    if(stack.get('databases.length') === 0) {
      this.replaceWith('databases.new', this.modelFor('stack'));
    }
  }
});
