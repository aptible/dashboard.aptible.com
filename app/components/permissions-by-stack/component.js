import Ember from 'ember';

export default Ember.Component.extend({
  scopesString: Ember.computed('scopesResult', function(){
    return this.get('scopesResult');
  }),

  scopes: Ember.computed('stack', 'role.types', function() {
    const role = this.get('role');
    const stack = this.get('stack');
    stack.scopesForRole(role).then(function(scopes) {
      this.set('scopesResult', scopes.join(', '));
    });
  })
});
