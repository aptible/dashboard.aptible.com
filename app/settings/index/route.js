import Ember from 'ember';

export default Ember.Route.extend({
  redirect: function(){
    this.replaceWith('settings.profile');
  }
});
