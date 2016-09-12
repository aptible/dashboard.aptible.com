import Ember from 'ember';

export default Ember.Component.extend({
  authorization: Ember.inject.service(),
  tagName: '',

  scope: null,
  permittable: null,
  hasAbility: Ember.computed('scope', 'permittable', function(){
    let { scope, permittable } = this.getProperties('scope', 'permittable');

    Ember.debug("You must provide a scope to aptible-ability", !!scope);
    Ember.debug("You must provide a permittable to aptible-ability", !!permittable);

    return this.get('authorization').checkAbility(scope, permittable);
  })
});
