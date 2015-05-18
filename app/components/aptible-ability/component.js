import Ember from 'ember';

export default Ember.Component.extend({
  hasAbility: false,
  tagName: '', // tagName must be exactly '' to render this component with no surrounding tag

  user: null,
  scope: null,
  permittable: null,

  checkAbility: function(){
    var user  = this.get('user'),
        scope = this.get('scope'),
        permittable = this.get('permittable'),
        component = this;

     Ember.assert("You must provide a user to aptible-ability", !!user);
     Ember.assert("You must provide a scope to aptible-ability", !!scope);
     Ember.assert("You must provide a permittable to aptible-ability", !!permittable);

     user.can(scope, permittable).then(function(bool){
       if (component.isDestroyed) { return; }

       component.set('hasAbility', bool);
     });
  }.on('willInsertElement')
});
