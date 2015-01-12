import Ember from 'ember';
import can from '../../utils/can';

export default Ember.Component.extend({
  hasAbility: false, // cannot use `isVisible` with `tagName: ''`
  tagName: '',

  user: null,
  scope: null,
  stack: null,

  checkAbility: function(){
    var user  = this.get('user'),
        scope = this.get('scope'),
        stack = this.get('stack'),
        component = this;

     Ember.assert("You must provide a user to aptible-ability", user);
     Ember.assert("You must provide a scope to aptible-ability", scope);
     Ember.assert("You must provide a stack to aptible-ability", stack);

     can(user, scope, stack).then(function(bool){
       if (component.isDestroyed) { return; }

       component.set('hasAbility', bool);
     });
  }.on('didInsertElement')
});
