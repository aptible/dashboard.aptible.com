import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function(){
    if(this.session.get('isAuthenticated')) {
      return this.store.find('stack').then((stacks) => {
        if (stacks.get('length') !== 0) {
          this.transitionTo('index');
        }
      });
    } else {
      this.transitionTo('login');
    }
  },

  model: function(){
    return this.store.find('organization').then(function(organizations){
      return {
        stackHandle: organizations.objectAt(0).get('name').dasherize(),
        appHandle: '',
        dbHandle: '',
        diskSize: 10,
        dbType: null
      };
    });
  }
});
