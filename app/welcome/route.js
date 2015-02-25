import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return this.store.find('organization').then(function(organizations){
      return {
        stackHandle: organizations.objectAt(0).get('name').dasherize(),
        appHandle: '',
        dbHandle: '',
        initialDiskSize: 10,
        dbType: null
      };
    });
  },

  beforeModel: function() {
    if(!this.session.get('isAuthenticated')) {
      this.transitionTo('login');
    }
  }
});
