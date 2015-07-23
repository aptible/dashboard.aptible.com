import Ember from 'ember';

export default Ember.Route.extend({
  title: function(){
    var stack = this.modelFor('stack');
    return `${stack.get('handle')} Certificates - ${stack.get('organization.name')}`;
  },
  model: function(){
    var stack = this.modelFor('stack');
    return stack.get('certificates');
  }
});
