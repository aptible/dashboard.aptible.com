import Ember from 'ember';

export default Ember.Component.extend({
  scopes: Ember.computed('role.type', function() {
    let roleId = this.get('role').get('id');
    let scopes = [];
    this.get('stack').get('permissions').forEach(function(permission) {
      if (permission.get('data.links.role').split('/').pop() === roleId) {
        scopes.push(permission.get('scope'));
      }
    });
    return scopes.join(', ');
  })
});
