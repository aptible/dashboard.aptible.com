import Ember from 'ember';

export default Ember.Route.extend({
  redirect: function(){
    var organizations = this.modelFor('organizations');
    var organization = organizations.objectAt(0);
    this.replaceWith('stacks', organization);
  }
});
