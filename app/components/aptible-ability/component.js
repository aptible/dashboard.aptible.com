import Ember from 'ember';

export default Ember.Component.extend({
  hasAbility: false,
  tagName: '', // tagName must be exactly '' to render this component with no surrounding tag

  user: null,
  scope: null,
  permittable: null,

  checkAbility: Ember.on('willInsertElement', function(){
    var user  = this.get('user'),
        scope = this.get('scope'),
        permittable = this.get('permittable'),
        role = this.get('role'),
        component = this;

    Ember.assert("You must provide a user to aptible-ability", !!user);
    Ember.assert("You must provide a scope to aptible-ability", !!scope);
    Ember.assert("You must provide a permittable to aptible-ability", !!permittable);

    user.can(scope, permittable).then((bool) => {
      if (component.isDestroyed) { return; }

      component.set('hasAbility', bool);

      // Only check the membership of a role if the user does not have ability
      // and the role exists
      if (!bool && role && role.get('requiresPermissions')) {
        role.get('memberships').then((memberships) => {
          var membership = user.findMembership(memberships);

          if (component.isDestroyed || !membership) { return; }

          component.set('hasAbility', membership.get('privileged'));
        });
        return;
      }
    });
  })
});
